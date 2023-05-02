import { GetServerSidePropsContext } from 'next';
import FileInput from '@/components/ui/FileInput/FileInput';
import FilesList from '@/components/ui/FilesList';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { getDocumentList, supabase } from '@/utils/supabase-client';
import React, { useState } from 'react';
import { Document } from '../types';
import { Database } from '../types/supabase';
import { RotatingLines } from 'react-loader-spinner';

export default function HomePage({ documents }: { documents: Document[] }) {
  const [documentsList, setDocumentsList] = useState<Document[]>(documents);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const handleFileDelete = async (documentIds: string[]) => {
    // remove from db
    const { error } = await supabase
      .from('document')
      .delete()
      .in('id', documentIds);
    if (error) {
      // TODO: Handle failed file removal
      console.error(error.message);
      return false;
    } else {
      // remove all documents selected for removal based on ID
      setDocumentsList(
        documentsList.filter((doc) => !documentIds.includes(doc.id))
      );
      return true;
    }
  };

  const updateDocumentList = async () => {
    try {
      setLoadingDocuments(true);
      const documents = await getDocumentList();
      setDocumentsList(documents);
    } catch (e: any) {
      // TODO: Handle failed document list update
      console.error(e.message);
    } finally {
      setLoadingDocuments(false);
    }
  };

  return (
    <>
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            File Manager
          </h1>
        </div>
      </header>
      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <FileInput updateDocumentList={updateDocumentList} />
      </div>
      <div className="mx-auto max-w-7xl pt-2 pb-6 sm:px-6 lg:px-8">
        {loadingDocuments ? (
          <section className="container px-4 mx-auto flex items-center place-content-center h-[45vh]">
            <RotatingLines
              strokeColor="#9ca3af"
              strokeWidth="1.5"
              animationDuration="1"
              width="4.5rem"
              visible={true}
            />
          </section>
        ) : (
          <FilesList
            documents={documentsList}
            deleteDocumentAction={handleFileDelete}
          />
        )}
      </div>
    </>
  );
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const supabase = createServerSupabaseClient<Database>(context);
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session)
    return {
      redirect: {
        destination: '/signin',
        permanent: false
      }
    };

  let documents: Document[] = [];

  try {
    documents = await getDocumentList(supabase);
    return {
      props: {
        documents,
        error: null
      }
    };
  } catch (e: any) {
    console.error(e.message);
    return {
      documents,
      error: e.message
    };
  }
};
