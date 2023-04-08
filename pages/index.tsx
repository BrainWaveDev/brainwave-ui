import { GetServerSidePropsContext } from 'next';
import FileInput from '@/components/ui/FileInput/FileInput';
import FilesList from '@/components/ui/FilesList';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { Document } from '../types';

interface Props {
  documents: Document[];
}

export default function HomePage({ documents }: Props) {
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
