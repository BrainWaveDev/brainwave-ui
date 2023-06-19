import { Columns } from '@/components/ui/FilesList/FilesList';
import { TriangleDownIcon, TriangleUpIcon } from '@radix-ui/react-icons';
import classNames from 'classnames';
import SearchIcon from '@/components/icons/SearchIcon';
import React, { memo } from 'react';
import * as Separator from '@radix-ui/react-separator';

export default memo(function TableHeader({
  setFilter,
  sortByColumn = null,
  sortAscending,
  handleColumnClick,
  allDocumentsSelected,
  selectAllDocuments,
  settingsDropdown,
  deleteButton,
  columnWidths
}: {
  setFilter: (filter: string) => void;
  sortByColumn: number | null;
  sortAscending: boolean;
  handleColumnClick: (column: number) => void;
  allDocumentsSelected: boolean;
  selectAllDocuments: (selectAll: boolean) => void;
  settingsDropdown?: JSX.Element;
  deleteButton?: JSX.Element;
  columnWidths: { [_: string]: string };
}) {
  return (
    <thead className="relative block z-10 w-full">
      {/* Visually separate the table header from the rest of the table */}
      <tr>
        <th
          className={classNames(
            'absolute rounded-lg top-0 -left-2 -right-2 lg:-left-8 lg:-right-8 bottom-0 -z-10 shadow-sm',
            'bg-transparent dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700'
          )}
        />
      </tr>
      <tr className={'relative flex'}>
        <th className={'pl-2 pr-1 lg:pr-0 py-2 w-full'}>
          <div
            className={classNames(
              'w-full flex flex-row items-center h-full top-0 py-2 place-content-between',
              settingsDropdown || deleteButton
                ? 'place-content-between'
                : 'place-content-end'
            )}
          >
            <div
              className={
                'flex items-center place-self-center my-auto gap-x-2 md:gap-x-3'
              }
            >
              <input
                type="checkbox"
                className={classNames(
                  'block table-layout:hidden text-teal-400 border-gray-300 rounded cursor-pointer',
                  'focus:outline-0 active:outline-0 focus:ring-teal-400 w-4 h-4 ml-1 mr-0.5',
                  'bg-white dark:bg-zinc-700 dark:border-zinc-700 dark:focus:ring-zinc-700 dark:focus:ring-1'
                )}
                onChange={(event) => selectAllDocuments(event.target.checked)}
                checked={allDocumentsSelected}
              />
              {settingsDropdown}
              {deleteButton}
            </div>
            <div className="flex items-center my-auto gap-x-0">
              <label htmlFor="table-search" className="sr-only">
                Search
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <SearchIcon className="h-5 w-5 lg:w-6 lg:h-6 text-gray-800 dark:text-gray-400" />
                </div>
                <input
                  type="text"
                  id="table-search-users"
                  className={classNames(
                    'block py-2 pl-12 pr-0 mr-0 text-sm lg:text-base text-gray-700 font-normal',
                    'border-none placeholder:text-gray-400 placeholder:font-normal rounded-lg w-44 sm:w-56 lg:w-64 xl:w-80',
                    'bg-gray-100/75 focus:outline-0 focus:ring-0 outline-none appearance-none',
                    'dark:bg-zinc-800 dark:placeholder:text-gray-400 dark:text-white'
                  )}
                  placeholder="Search for files"
                  onChange={(e) => {
                    setFilter(e.target.value);
                  }}
                />
              </div>
            </div>
          </div>
        </th>
      </tr>
      <tr className={'hidden table-layout:flex'}>
        <th className={'px-0 h-fit z-20 w-full'}>
          <Separator.Root className="bg-gray-200 dark:bg-zinc-700 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full" />
        </th>
      </tr>
      <tr className={'hidden table-layout:flex py-0 md:py-1'}>
        <th
          className={classNames(
            'py-3.5 pl-4 pr-5 font-normal text-left text-gray-500 dark:text-gray-300',
            columnWidths.name
          )}
        >
          <div className="flex items-center gap-x-3 z-10">
            <input
              type="checkbox"
              className={classNames(
                'text-teal-400 border-gray-300 rounded cursor-pointer',
                'focus:outline-0 active:outline-0 focus:ring-teal-400',
                'bg-white dark:bg-zinc-700 dark:border-zinc-700 dark:focus:ring-zinc-700 dark:focus:ring-1'
              )}
              onChange={(event) => selectAllDocuments(event.target.checked)}
              checked={allDocumentsSelected}
            />
            <ColumnName
              name={'Name'}
              selected={sortByColumn === Columns.name}
              sortAscending={sortAscending}
              handleColumnClick={() => handleColumnClick(Columns.name)}
            />
          </div>
        </th>
        <th
          scope="col"
          className={classNames(
            'py-3.5 text-base font-normal text-left text-gray-500 dark:text-gray-300',
            columnWidths.size
          )}
        >
          <ColumnName
            name={'Size'}
            selected={sortByColumn === Columns.size}
            sortAscending={sortAscending}
            handleColumnClick={() => handleColumnClick(Columns.size)}
          />
        </th>
        <th
          scope="col"
          className={classNames(
            'py-3.5 text-base font-normal text-left text-gray-500 dark:text-gray-300',
            columnWidths.kind
          )}
        >
          <ColumnName
            name={'Kind'}
            selected={sortByColumn === Columns.kind}
            sortAscending={sortAscending}
            handleColumnClick={() => handleColumnClick(Columns.kind)}
          />
        </th>
        <th
          scope="col"
          className={classNames(
            'py-3.5 text-base font-normal text-gray-500 dark:text-gray-300',
            columnWidths.dateUploaded
          )}
        >
          <ColumnName
            name={'Date Uploaded'}
            selected={sortByColumn === Columns.dateUploaded}
            sortAscending={sortAscending}
            handleColumnClick={() => handleColumnClick(Columns.dateUploaded)}
          />
        </th>
        <th
          scope="col"
          className={classNames(
            'py-3.5 text-base font-normal text-left text-gray-500 dark:text-gray-300',
            columnWidths.status
          )}
        >
          <ColumnName
            name={'Status'}
            selected={sortByColumn === Columns.status}
            sortAscending={sortAscending}
            handleColumnClick={() => handleColumnClick(Columns.status)}
          />
        </th>
      </tr>
    </thead>
  );
});

const ColumnName = memo(
  ({
    name,
    selected,
    sortAscending,
    handleColumnClick
  }: {
    name: string;
    selected: boolean;
    sortAscending: boolean;
    handleColumnClick: () => void;
  }) => {
    return (
      <div
        className={classNames(
          'flex flex-row place-content-between items-center w-fit group cursor-pointer z-20 pl-2 relative',
          'border border-opacity-0 border-gray-400 rounded-md hover:border-opacity-50 active:border-opacity-50',
          'hover:bg-gray-50 dark:hover:bg-zinc-800 hover:z-30',
          '',
          name.toLowerCase() === 'name' ? 'ml-0' : '-ml-3'
        )}
        onClick={handleColumnClick}
      >
        <span
          className={classNames(
            'capitalize whitespace-nowrap text-xs md:text-sm lg:text-base',
            name.toLowerCase() === 'date uploaded' ? 'mr-0.5' : 'mr-3'
          )}
        >
          {name}
        </span>
        <div
          className={classNames(
            'flex flex-col items-center opacity-0',
            'group-hover:opacity-100 group-active:opacity-100',
            'transition duration-150 gap-y-0.5 sm:gap-y-0'
          )}
        >
          <TriangleUpIcon
            className={classNames(
              'w-4 h-4 sm:w-5 sm:h-5 stroke-none text-gray-400 -mb-1.5',
              'transition duration-150',
              selected && sortAscending && 'text-gray-500'
            )}
          />
          <TriangleDownIcon
            className={classNames(
              'w-4 h-4 sm:w-5 sm:h-5 stroke-none text-gray-400 -mt-1.5',
              'transition duration-150',
              selected && !sortAscending && 'text-gray-500'
            )}
          />
        </div>
      </div>
    );
  }
);
