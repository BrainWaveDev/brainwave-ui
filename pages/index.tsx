import { GetServerSidePropsContext } from 'next';
import FileInput from '@/components/ui/FileInput/FileInput';
import FilesList from '@/components/ui/FilesList';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { Document } from '../types';
import { useEffect } from 'react';
import { useUser } from '@/utils/useUser';
import { supabase } from '@/utils/supabase-client';

interface Props {
  documents: Document[];
}

const getQueryContext = async (query: string) => {
  // Retrieve user's access token for identification on the server
  const {
    data: { session },
    error
  } = await supabase.auth.getSession();

  if (error || !session || !session.access_token) {
    throw Error('Error getting current user session');
  }

  const request: RequestInit = {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify({
      query,
      jwt: session.access_token
    })
  };

  const res: Response = await fetch('/api/vector-search', request);
  if (!res.ok) {
    console.error('Error in getting query context', res);
  } else {
    const queryContext = await res.json();
    console.log(queryContext);
  }
};

export default function HomePage({ documents }: Props) {
  const { isLoading, user } = useUser();
  console.log(user);

  useEffect(() => {
    if (!isLoading && user) getQueryContext('What is determinism?');
  }, [isLoading, user]);
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
        <FilesList documents={documents} />
      </div>
    </>
  );
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const supabase = createServerSupabaseClient(context);
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

  const { data: documents } = await supabase.from('document').select();

  return {
    props: {
      documents
    }
  };
};
