import { GetServerSidePropsContext } from 'next';
import FileInput from '@/components/ui/FileInput/FileInput';
import FilesList from '@/components/ui/FilesList';
import { getDocumentList, supabase } from '@/utils/supabase-client';
import React, { useState } from 'react';
import { Document } from '../types';
import { RotatingLines } from 'react-loader-spinner';
import { ErrorAlert, useErrorContext } from '../context/ErrorContext';
import { getDocumentListServerSideProps } from '@/utils/supabase-admin';
import classNames from 'classnames';

export default function Files({
  documents
}: {
  documents: Document[];
  error?: string;
}) {
  const [documentsList, setDocumentsList] = useState<Document[]>(documents);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const { dispatch: dispatchError } = useErrorContext();

  const handleFileDelete = async (documentIds: number[]) => {
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
    <div
      className={classNames(
        'relative flex flex-col grow max-w-full overflow-y-scroll',
        'max-h-full rounded-[1.25rem] w-full h-[calc(100%_-_4.5rem)]'
        // pr-[22.5rem]
      )}
    >
      {/* File list and upload */}
      <div
        className={
          'relative flex flex-col items-center max-w-full min-w-full min-h-fit h-full'
        }
      >
        <div className="pt-6 w-full max-w-7xl px-4 sm:px-8">
          <FileInput updateDocumentList={updateDocumentList} />
        </div>
        <div className="py-6 relative w-full max-w-7xl grow">
          {/* File upload and list */}
          {loadingDocuments ? (
            <section className="container px-4 mx-auto flex items-center place-content-center">
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
      </div>
      {/* Display remaining space */}
      {/* TODO: Implement the sidebar */}
      {/*<div*/}
      {/*  className={classNames(*/}
      {/*    'absolute top-0 right-0 bottom-0 flex flex-col min-w-[22.5rem]',*/}
      {/*    'pt-[8rem] pb-24 rounded-r-[1.25rem] rounded-l-none shadow-[inset_0_1.5rem_3.75rem_rgba(0,0,0,0.1)]',*/}
      {/*    'border-l border-gray-200 dark:border-zinc-700'*/}
      {/*  )}*/}
      {/*></div>*/}
    </div>
  );
}

export const getServerSideProps = async (context: GetServerSidePropsContext) =>
  getDocumentListServerSideProps(context);
