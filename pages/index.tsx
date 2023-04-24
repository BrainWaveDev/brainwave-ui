import { GetServerSidePropsContext } from 'next';
import FileInput from '@/components/ui/FileInput/FileInput';
import FilesList from '@/components/ui/FilesList';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { supabase } from '@/utils/supabase-client';
import { useState } from 'react';
import { DocMetadata, Document } from '../types';
import { Database } from '../types/supabase';

export default function HomePage({ documents }: { documents: Document[] }) {
  const [documentsList, setDocumentsList] = useState<Document[]>(documents);
  const handleFileDelete = (names: string[]) => {
    const stashDocuments = [...documentsList];
    // remove all docs with name from given names
    const newDocumentsList = documentsList.filter(
      (doc) => !names.includes(doc.name)
    );
    setDocumentsList(newDocumentsList);

    // remove from db
    supabase
      .from('document')
      .delete()
      .in('name', names)
      .then((data) => {
        if (data.status !== 204) {
          // if delete failed, restore documents
          setDocumentsList(stashDocuments);
        }
      });
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
        <FileInput />
      </div>
      <div className="mx-auto max-w-7xl pt-2 pb-6 sm:px-6 lg:px-8">
        <FilesList
          documents={documentsList}
          deleteDocumentAction={handleFileDelete}
        />
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

  const { data } = await supabase.from('document').select();
  // Default sorting by date
  let documents: Document[] = [];
  if (data && data.length > 0) {
    documents = data
      .map((document) => ({
        ...document,
        id: document.id.toString(),
        // @ts-ignore
        metadata: document.metadata as DocMetadata
      }))
      .sort((a, b) =>
        new Date(a.metadata.lastModified) > new Date(b.metadata.lastModified)
          ? -1
          : 1
      );
  }
  return {
    props: {
      documents
    }
  };
};
