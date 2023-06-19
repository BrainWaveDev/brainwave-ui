import FileInput from '@/components/ui/FileInput/FileInput';
import FilesList from '@/components/ui/FilesList';
import React from 'react';
import classNames from 'classnames';
import { initStore } from '../context/redux/store';

export default function Files() {
  return (
    <div
      className={classNames(
        'relative flex flex-col grow max-w-full overflow-y-scroll',
        'max-h-full rounded-[1.25rem] w-full h-full'
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
          <FileInput />
        </div>
        <div className="py-6 relative w-full max-w-7xl grow">
          {/* File upload and list */}
          <FilesList />
        </div>
      </div>
      {/* Display remaining space */}
      {/* TODO: Implement the sidebar */}
    </div>
  );
}

export const getServerSideProps = initStore;
