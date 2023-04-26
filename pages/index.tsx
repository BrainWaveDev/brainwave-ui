import { GetServerSidePropsContext } from 'next';
import FileInput from '@/components/ui/FileInput/FileInput';
import FilesList from '@/components/ui/FilesList';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { Document } from '../types';
import { supabase } from '@/utils/supabase-client';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const { documentsList, refreshDocuments,setDocumentsList } = useDocuments();

  
  const handleFileDelete = (names: string[]) => {
    const stashDocuments = [...documentsList];
    // remove all docs with name from given names
    const newDocumentsList = documentsList.filter((doc) => !names.includes(doc.name));
    setDocumentsList(newDocumentsList);

    console.log(names);
    // remove from db
    supabase.from('document').delete().in('name', names)
    .then((data) => {
      if(data.status !== 204){
        // if delete failed, restore documents
        setDocumentsList(stashDocuments);
      } else {
        // Refresh documentsList after successful deletion
        refreshDocuments();
      }
    })

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
      
      <div className="mx-auto max-w-7xl pt-2 pb-6 sm:px-6 lg:px-8 ">
        <FilesList documents={documentsList} deleteDocumentAction={handleFileDelete} />
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

  return {
    props: {
      placeHolder: 'placeholder'
    }
  }
};


const useDocuments = () => {
  const [documentsList, setDocumentsList] = useState<Document[]>([]);

  const fetchDocuments = async () => {
    const { data, error } = await supabase.from('document').select();
    if (error) {
      throw error;
    }
    return data as Document[];
  };

  const refreshDocuments = () => {
    fetchDocuments()
      .then((data) => {
        setDocumentsList(data);
      })
      .catch((error) => {
        // TODO: handle error
        console.log(error);
      });
  };

  useEffect(() => {
    refreshDocuments();
  }, []);

  return { documentsList, refreshDocuments,setDocumentsList};
};