import { GetServerSidePropsContext } from 'next';
import FileInput from '@/components/ui/FileInput/FileInput';
import FilesList from '@/components/ui/FilesList';
import { getDocumentList, supabase } from '@/utils/supabase-client';
import React, { useState } from 'react';
import { Document } from '../types';
import { RotatingLines } from 'react-loader-spinner';
import { ErrorAlert, useErrorContext } from '../context/ErrorContext';
import { getDocumentListServerSideProps } from '@/utils/supabase-admin';

export default function HomePage({ documents }: { documents: Document[] }) {
  const [documentsList, setDocumentsList] = useState<Document[]>(documents);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const { dispatch: dispatchError } = useErrorContext();

  const handleFileDelete = async (documentIds: string[]) => {
    // remove from db
    const { error } = await supabase
      .from('document')
      .delete()
      .in('id', documentIds);
    if (error) {
      const newError = new ErrorAlert(
        `Failed to delete document${documentIds.length > 1 ? 's' : ''}`
      );
      dispatchError({ type: 'addError', error: newError });
      // Automatically clear error alert
      setTimeout(() => {
        dispatchError({
          type: 'removeError',
          id: newError.id
        });
      }, 3000);

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
      const newError = new ErrorAlert(
        'Failed to update document list. Please try again.'
      );
      dispatchError({ type: 'addError', error: newError });
      // Automatically clear error alert
      setTimeout(() => {
        dispatchError({
          type: 'removeError',
          id: newError.id
        });
      }, 3000);

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

export const getServerSideProps = async (context: GetServerSidePropsContext) =>
  getDocumentListServerSideProps(context);
