import classNames from 'classnames';
import React, { memo } from 'react';
import { useRouter } from 'next/router';
import {
  getModalStateFromStorage,
  toggleSidebar,
  toggleDocumentFilter
} from '../../../context/redux/modalSlice';
import { useAppDispatch } from '../../../context/redux/store';
import { MixerHorizontalIcon } from '@radix-ui/react-icons';

// Selects appropriate header tag based on the page
const HeaderTag = (pathname: string) => {
  switch (pathname) {
    case '/chat':
      return 'Chat';
    case '/files':
      return 'Files';
    default:
      return '';
  }
};

export default memo(function Header() {
  // ==============================
  // Sidebar State from Redux Store
  // ==============================
  const { sideBarOpen } = getModalStateFromStorage();
  const dispatch = useAppDispatch();
  const onToggleSidebar = () => dispatch(toggleSidebar());
  const onToggleDocumentFilter = () => {
    dispatch(toggleDocumentFilter());
  };

  // ==============================
  // Selects appropriate header tag based on the page
  // ==============================
  const router = useRouter();

  // ==============================
  // Tailwind Classes
  // ==============================
  const sideBarSpanClass = classNames(
    'w-5 h-0.5 my-0.5 bg-neutral7 dark:bg-neutral4',
    'rounded-full transition-all',
    'duration-300 group-hover:bg-teal-400 group-active:bg-teal-400'
  );
  const headerShadow = classNames(
    'lg:shadow-[0_0.75rem_2.5rem_-0.75rem_rgba(0,0,0,0.06)]',
    'lg:dark:shadow-[0_0.75rem_2.5rem_-0.75rem_rgba(0,0,0,0.15)]'
  );

  return (
    <>
      {sideBarOpen && (
        <div
          // Overlay to hide chat when sidebar is open on mobile
          className={classNames(
            'absolute sm:hidden top-0 right-0 left-0 bottom-0',
            'bg-gray-100 dark:bg-neutral6 backdrop-blur-xl',
            sideBarOpen ? 'z-30' : 'z-20'
          )}
        />
      )}
      <header
        className={classNames(
          'flex flex-row items-center justify-between min-h-[4.5rem] h-[4.5rem] py-3 sm:border-b',
          'border-gray-200',
          'dark:border-zinc-700',
          !sideBarOpen && 'border-b',
          // Apply bottom shadow only on the files page
          router.pathname === '/files' && headerShadow,
          'overflow-visible relative',
          'pl-8 sm:pr-6',
          sideBarOpen ? 'z-30' : 'z-20',
          'sm:z-20'
        )}
      >
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          {HeaderTag(router.pathname)}
        </h1>
        {/* Sidebar opening button on mobile screens*/}
        <button
          className={`flex sm:hidden absolute shrink-0 flex-col items-start justify-center w-9 h-9 overflow-visible ${
            sideBarOpen ? 'right-[calc((100vw_-_22rem)/2)]' : 'right-4'
          } xs:right-6 transition-all duration-300 focus:outline-0 focus:!ring-0 group`}
          onClick={onToggleSidebar}
        >
          <span
            className={classNames(
              sideBarSpanClass,
              sideBarOpen && 'translate-y-[0.1875rem] rotate-45'
            )}
          />
          <span
            className={classNames(
              sideBarSpanClass,
              sideBarOpen && '-translate-y-[0.1875rem] -rotate-45'
            )}
          />
        </button>
        {router.pathname === '/chat' && (
          <button
            // Document Filter Button
            className={classNames(
              'hidden lg:flex group shadow rounded-full w-9 h-9 items-center justify-center',
              'bg-white dark:bg-zinc-700 hover:bg-gray-100 active:bg-gray-100 dark:hover:bg-neutral4/70',
              'border border-gray-100 dark:border-zinc-700',
              'transition-all duration-150 focus:outline-0 focus:ring-0 focus:border-gray-100',
              'text-gray-600 dark:text-white'
            )}
            onClick={onToggleDocumentFilter}
          >
            <MixerHorizontalIcon strokeWidth={1} className={'w-4 h-4'} />
          </button>
        )}
      </header>
    </>
  );
});
