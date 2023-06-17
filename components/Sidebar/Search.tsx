import { ChangeEvent, createRef, memo } from 'react';
import classNames from 'classnames';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import {
  getSidebarStateFromStorage,
  setSidebar
} from '../../context/redux/sidebarSlice';
import { useAppDispatch } from '../../context/redux/store';

export default memo(function Search({
  searchTerm,
  setSearchTerm
}: {
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
}) {
  // =========================
  // Redux State
  // =========================
  const dispatch = useAppDispatch();
  const sidebarOpen = getSidebarStateFromStorage();
  const openSidebar = () => dispatch(setSidebar(true));

  // =========================
  // Local State
  // =========================
  const searchRef = createRef<HTMLInputElement>();
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div
      className={`relative flex items-center w-[calc(100%_-_0.375rem)] group ${
        sidebarOpen ? 'ml-1' : 'ml-0.5 cursor-pointer'
      }`}
      onClick={() => {
        if (!sidebarOpen) openSidebar();
        searchRef.current?.focus();
      }}
    >
      <input
        className={classNames(
          'w-full flex-1 rounded-lg border border-neutral-600 mb-2',
          'bg-neutral6 px-4 py-3 pr-0 text-sm leading-3 text-white',
          'focus:ring-0 focus:border-neutral-400 placeholder:text-zinc-500',
          !sidebarOpen && 'cursor-pointer text-opacity-0'
        )}
        type="text"
        placeholder={sidebarOpen ? 'Search conversations...' : ''}
        value={searchTerm}
        onChange={handleSearchChange}
        ref={searchRef}
        readOnly={!sidebarOpen}
      />
      {sidebarOpen && searchTerm && (
        <XMarkIcon
          className={classNames(
            'absolute right-3 w-[18px] text-neutral-400',
            'hover:text-neutral-100 cursor-pointer'
          )}
          onClick={clearSearch}
        />
      )}
      {!sidebarOpen && (
        <MagnifyingGlassIcon
          className={classNames(
            'absolute top-3 left-3 h-5 stroke-neutral-400 group-hover:stroke-white ',
            'transition duration-150'
          )}
          strokeWidth={1}
        />
      )}
    </div>
  );
});
