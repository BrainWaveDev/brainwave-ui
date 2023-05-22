import FileInput from '@/components/ui/FileInput/FileInput';
import FilesList from '@/components/ui/FilesList';
import { useEffect, useState } from 'react';
import { RotatingLines } from 'react-loader-spinner';
import { ErrorAlert, useErrorContext } from '../context/ErrorContext';
import { useAppDispatch, useAppSelector } from 'context/redux/store';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { optimisticDocumentActions } from 'context/redux/documentSlice';
export default function HomePage({
}: {
  error?: string;
}) {
  const { isLoading, session, error } = useSessionContext();
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (isLoading || error) {
      return;
    }
    // client fetch for redux, since SEO is not important here
    const user = session?.user;
    dispatch(optimisticDocumentActions.fetchAllDocuments(user?.id!))
  }, [isLoading, error]);

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
        {isLoading ? (
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
          <FilesList/>
        )}
      </div>
    </>
  );
}

