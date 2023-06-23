import FileInput from '@/components/ui/FileInput/FileInput';
import FilesList from '@/components/ui/FilesList';
import { initStore } from 'context/redux/store';

export default function HomePage({ error }: { error: string | null }) {
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
        <FilesList />
      </div>
    </>
  );
}

export const getServerSideProps = initStore;
