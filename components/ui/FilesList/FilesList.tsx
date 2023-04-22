import FilterPopover from '@/components/ui/FilesList/FilterPopover';
import ActionsPopover from '@/components/ui/FilesList/ActionsPopover';
import SearchIcon from '@/components/icons/SearchIcon';
import classes from './FilesList.module.css';
import { Document } from 'types';
import classNames from 'classnames';
import { motion, AnimatePresence } from 'framer-motion';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import RowPopover from './RowPopover';

interface Props {
  documents: Document[];
  deleteDocumentAction: (ids: string[]) => void;
}

const ONE_PAGE_SIZE = 5;

export default function FilesList(props: Props) {
  const [currentPage, setCurrentPage] = useState(0);
  const [filter, setFilter] = useState('');

  const splitArray = (array: Document[], chunkSize: number): Document[][] => {
    const result: Document[][] = [];

    for (let i = 0; i < array.length; i += chunkSize) {
      const chunk = array.slice(i, i + chunkSize);
      result.push(chunk);
    }

    if (result.length === 0) {
      return [[]];
    }
    return result;
  };

  const selectDisplayedDocuments = (
    documentPages: Document[][],
    totalPages: number
  ) => {
    // Adjust current page index if is greater than total number of pages
    if (currentPage >= totalPages) {
      const adjustedPageIndex = totalPages > 0 ? totalPages - 1 : 0;
      setCurrentPage(adjustedPageIndex);
      return documentPages[adjustedPageIndex].map((document) =>
        DocumentRow(document, () => props.deleteDocumentAction([document.name]))
      );
    } else {
      return documentPages[currentPage].map((document) =>
        DocumentRow(document, () => props.deleteDocumentAction([document.name]))
      );
    }
  };

  const filteredDocuments = props.documents.filter((doc) => {
    return doc.name.toLowerCase().includes(filter.trim().toLowerCase());
  });
  const documentPages = splitArray(filteredDocuments, ONE_PAGE_SIZE);
  const totalPages = documentPages.length;
  const displayedDocuments = selectDisplayedDocuments(
    documentPages,
    totalPages
  );

  return (
    <section className="container px-4 mx-auto">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div className={'flex items-center place-self-center'}>
          <FilterPopover />
          <ActionsPopover />
        </div>
        <div className="flex items-center my-auto gap-x-3">
          <label htmlFor="table-search" className="sr-only">
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <SearchIcon className="w-5 h-5 text-gray-600" />
            </div>
            <input
              type="text"
              id="table-search-users"
              className={classes.input}
              placeholder="Search for files"
              onChange={(e) => {
                setFilter(e.target.value);
              }}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col mt-6">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 table-fixed">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  {TableHeader()}
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                  <AnimatePresence initial={false}>
                    {displayedDocuments.length > 0 ? (
                      displayedDocuments
                    ) : (
                      <motion.tr
                        key={'NoDataToDisplay'}
                        initial={{ opacity: 0, display: 'none' }}
                        animate={{ opacity: 1, display: 'table-row' }}
                        exit={{ opacity: 0, display: 'none' }}
                        transition={{ duration: 0.15 }}
                      >
                        <td
                          colSpan={1000}
                          className={
                            'px-4 py-4 text-sm text-gray-700 whitespace-nowrap'
                          }
                        >
                          <h2 className="font-normal text-gray-800 dark:text-white ">
                            No data to display.
                          </h2>
                        </td>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-6">
        <button
          onClick={(e) => {
            e.preventDefault();
            if (currentPage > 0) {
              setCurrentPage(currentPage - 1);
            }
          }}
          className={classNames(
            'flex items-center px-5 py-2 text-sm text-gray-700 capitalize',
            'transition-colors duration-200 bg-white border rounded-md gap-x-2',
            'hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200',
            'dark:border-gray-700 dark:hover:bg-gray-800 cursor-pointer',
            'transition duration-150',
            totalPages > 1 && currentPage > 0 ? 'opacity-100' : 'opacity-0'
          )}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5 rtl:-scale-x-100"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
            />
          </svg>
          <span>Previous</span>
        </button>

        <div className="items-center hidden md:flex gap-x-3">
          <PageIndexComponent
            totalPages={totalPages}
            setPage={setCurrentPage}
            currPage={currentPage}
          />
        </div>

        <button
          onClick={() => {
            if (currentPage < totalPages - 1) {
              setCurrentPage(currentPage + 1);
            }
          }}
          className={classNames(
            'flex items-center px-5 py-2 text-sm text-gray-700 capitalize',
            'transition-colors duration-200 bg-white border rounded-md gap-x-2',
            'hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200',
            'dark:border-gray-700 dark:hover:bg-gray-800 cursor-pointer',
            'transition duration-150',
            totalPages > 1 && currentPage < totalPages - 1
              ? 'opacity-100'
              : 'opacity-0'
          )}
        >
          <span>Next</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5 rtl:-scale-x-100"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
            />
          </svg>
        </button>
      </div>
    </section>
  );
}

function TableHeader() {
  return (
    <tr>
      <th
        scope="col"
        className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400 w-1/4"
      >
        <div className="flex items-center gap-x-3">
          <input
            type="checkbox"
            className="mr-2 text-blue-500 border-gray-300 rounded dark:bg-gray-900 dark:ring-offset-gray-900 dark:border-gray-700"
          />
          <span>File name</span>
        </div>
      </th>

      <th
        scope="col"
        className="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
      >
        File size
      </th>

      <th
        scope="col"
        className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
      >
        Date uploaded
      </th>

      <th
        scope="col"
        className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
      >
        Last updated
      </th>

      <th scope="col" className="relative py-3.5">
        <span className="sr-only">Edit</span>
      </th>
    </tr>
  );
}

function PageIndexComponent(props: {
  totalPages: number;
  setPage: Dispatch<SetStateAction<number>>;
  currPage: number;
}) {
  const pageNumberBox = (pageNumber: number, selected: boolean) => {
    return (
      <button
        key={`page-${pageNumber}`}
        className={classNames(
          'px-2 py-1 text-sm text-teal-500 rounded-md dark:bg-gray-800',
          'cursor-pointer transition duration-100',
          selected && 'bg-teal-200/50'
        )}
        onClick={(e) => {
          e.preventDefault();
          props.setPage(pageNumber);
        }}
      >
        {pageNumber + 1}
      </button>
    );
  };

  const ellipsis = () => (
    <span
      key={`ellipsis_${Math.random()}`}
      className="px-2 py-1 text-sm text-gray-500"
    >
      ...
    </span>
  );

  if (props.totalPages <= 5) {
    // display all page numbers
    return (
      <>
        {Array.from(Array(props.totalPages).keys()).map((pageNumber) => {
          return pageNumberBox(pageNumber, pageNumber === props.currPage);
        })}
      </>
    );
  } else {
    // display first page, last page, selected index, and ellipses
    const isFirstPageSelected = props.currPage === 0;
    const isLastPageSelected = props.currPage === props.totalPages - 1;
    const pages = [
      pageNumberBox(0, isFirstPageSelected),
      !isFirstPageSelected && props.currPage - 1 >= 1 ? ellipsis() : null,
      isFirstPageSelected || isLastPageSelected
        ? null
        : pageNumberBox(props.currPage, true),
      !isLastPageSelected && props.totalPages - props.currPage > 2
        ? ellipsis()
        : null,
      pageNumberBox(props.totalPages - 1, isLastPageSelected)
    ].filter(Boolean); // Remove null values from the array

    return <>{pages}</>;
  }
}

function DocumentRow(doc: Document, handleDelete: () => void) {
  const formatBytes = (bytes: number): string => {
    if (bytes < 1024) {
      return bytes + ' B';
    } else if (bytes < 1048576) {
      return (bytes / 1024).toFixed(2) + ' KB';
    } else if (bytes < 1073741824) {
      return (bytes / 1048576).toFixed(2) + ' MB';
    } else {
      return (bytes / 1073741824).toFixed(2) + ' GB';
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const month = date.toLocaleString('default', { month: 'long' });
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}, ${day}, ${year}`;
  };

  // Shorten document name is it is too long
  const formatDocumentName = (name: string) => {
    const documentName = name.split('/').pop();
    if (!documentName) return '';

    if (documentName.length < 55)
      return <p className={'inline m-0'}>{documentName}</p>;
    else
      return (
        <p title={documentName}>{`${documentName.substring(0, 55)}...`}</p>
      );
  };

  return (
    <motion.tr
      key={doc.id}
      initial={{ opacity: 0, display: 'none' }}
      animate={{ opacity: 1, display: 'table-row' }}
      exit={{ opacity: 0, display: 'none' }}
      transition={{ duration: 0.15 }}
    >
      <td className="inline-block px-4 py-4 w-[33rem] text-sm font-medium text-gray-700 whitespace-nowrap overflow-hidden">
        <div className="inline-flex items-center gap-x-3">
          <input
            type="checkbox"
            className="mr-2 text-blue-500 border-gray-300 rounded dark:bg-gray-900 dark:ring-offset-gray-900 dark:border-gray-700"
          />

          <div className="flex items-center gap-x-2">
            <div className="flex items-center w-8 h-8 text-teal-400 bg-teal-50 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5 mx-auto"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </svg>
            </div>
            <h2 className="font-normal text-gray-800 dark:text-white ">
              {formatDocumentName(doc.name)}
            </h2>
          </div>
        </div>
      </td>
      <td className="px-12 py-4 w-52 text-sm font-normal text-gray-700 whitespace-nowrap">
        {formatBytes(doc.metadata.size)}
      </td>
      <td className="px-4 py-4 w-48 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
        {formatDate(doc.metadata.lastModified)}
      </td>
      <td className="px-4 py-4 w-48 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
        {formatDate(doc.metadata.lastModified)}
      </td>
      <td className="px-4 py-4 text-sm whitespace-nowrap">
        <RowPopover handleDelete={handleDelete} />
      </td>
    </motion.tr>
  );
}
