import classNames from 'classnames';
import React, { memo } from 'react';
import { useRouter } from 'next/router';

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

export default memo(function Header({
  sidebarOpen,
  toggleSideBar
}: {
  sidebarOpen: boolean;
  toggleSideBar: () => void;
}) {
  // Selects appropriate header tag based on the page
  const router = useRouter();
  // Animate sidebar open/close button
  const sideBarSpanClass =
    'w-5 h-0.5 my-0.5 bg-neutral7 dark:bg-neutral4 rounded-full transition-all';

  return (
    <header
      className={classNames(
        'flex flex-row items-center justify-between min-h-[4.5rem] h-[4.5rem] pl-10 pr-6 py-3 border-b',
        'border-gray-200 shadow-[0_0.75rem_2.5rem_-0.75rem_rgba(0,0,0,0.06)',
        'dark:border-zinc-700 dark:shadow-[0_0.75rem_2.5rem_-0.75rem_rgba(0,0,0,0.15)]',
        'overflow-visible'
      )}
      onClick={toggleSideBar}
    >
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
        {HeaderTag(router.pathname)}
      </h1>
      {/* Sidebar opening button on mobile screens*/}
      <button className="flex sm:hidden relative shrink-0 flex-col items-start justify-center w-9 h-9 overflow-visible">
        <span
          className={classNames(
            sideBarSpanClass,
            sidebarOpen && 'translate-y-[0.1875rem] rotate-45'
          )}
        />
        <span
          className={classNames(
            sideBarSpanClass,
            sidebarOpen && '-translate-y-[0.1875rem] -rotate-45'
          )}
        />
      </button>
    </header>
  );
});
