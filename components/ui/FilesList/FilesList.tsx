import { Document } from '@/types/document';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import PageIndex from '@/components/ui/FilesList/PageIndex';
import React, { useCallback, useMemo, useState } from 'react';
import TableHeader from '@/components/ui/FilesList/TableHeader';
import AlertModal, {
  ModalState,
  ModalType,
  setModalOpen
} from '@/components/ui/AlertModal';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { useAppDispatch } from 'context/redux/store';
import {
  getDocumentsFromStore,
  optimisticDocumentActions
} from 'context/redux/documentSlice';
import DocumentRow from '@/components/ui/FilesList/DocumentRow';
import { TrashIcon } from '@heroicons/react/24/solid';
import SettingsDropdown from '@/components/ui/FilesList/SettingsDropdown';
import {
  endLoading,
  getLoadingStateFromStore,
  LoadingTrigger,
  startLoading
} from '../../../context/redux/loadingSlice';

export type DocumentsPerPage = '5' | '10' | '15' | '20';

export const FileType = (mimetype: string) => {
  switch (mimetype) {
    case 'text/plain':
      return 'TXT';
    case 'text/csv':
      return 'CSV';
    case 'application/pdf':
      return 'PDF';
    case 'application/msword':
      return 'DOC';
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return 'DOCX';
    case 'text/html':
      return 'HTML';
    default:
      return '';
  }
};

export const enum Columns {
  name,
  size,
  kind,
  dateUploaded,
  status
}

export const ColumnWidths = {
  name: 'w-[48%]',
  size: 'w-[12.5%]',
  kind: 'w-[8%]',
  dateUploaded: 'w-[19%]',
  status: 'w-[12.5%]'
};

export default function FilesList() {
  // ===================================================
  // Redux State
  // ===================================================
  const documents = getDocumentsFromStore();
  const fetchingDocuments = getLoadingStateFromStore(
    LoadingTrigger.FetchingDocuments
  );
  const deletingDocuments = getLoadingStateFromStore(
    LoadingTrigger.DeletingDocuments
  );
  const dispatch = useAppDispatch();

  // ===================================================
  // Local State
  // ===================================================
  const [currentPage, setCurrentPage] = useState(0);
  const [filter, setFilter] = useState('');
  const selectFilter = useCallback((filter: string) => setFilter(filter), []);
  const [sortByColumn, setSortByColumn] = useState<number | null>(null);
  const [sortAscending, setSortAscending] = useState(true);

  // List of document ids that were selected with input checkmarks in the document table
  const [selectedDocuments, setSelectedDocuments] = useState<Set<number>>(
    new Set<number>()
  );
  // Cached version of the function to improve performance
  const onDocumentSelect = useCallback((documentId: number) => {
    setSelectedDocuments((selectedDocuments) => {
      if (selectedDocuments.has(documentId)) {
        selectedDocuments.delete(documentId);
      } else {
        selectedDocuments.add(documentId);
      }
      return new Set(selectedDocuments);
    });
  }, []);

  const [modalState, setModalState] = useState<ModalState | null>(null);

  // ===================================================
  // Modal
  // ===================================================
  const ModalActionButtons = (
    <>
      <AlertDialog.Action
        asChild
        onClick={() => setModalState(setModalOpen(false))}
      >
        <button className="text-mauve11 bg-mauve4 hover:bg-mauve5 focus:shadow-mauve7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none outline-none focus:shadow-[0_0_0_2px]">
          Cancel
        </button>
      </AlertDialog.Action>
      <AlertDialog.Action
        asChild
        onClick={async () => {
          setModalState(setModalOpen(false));
          dispatch(startLoading(LoadingTrigger.DeletingDocuments));
          dispatch(
            optimisticDocumentActions.deleteDocuments(
              Array.from(selectedDocuments)
            )
          );
          setSelectedDocuments(new Set<number>());
          dispatch(endLoading(LoadingTrigger.DeletingDocuments));
        }}
      >
        <button className="text-red11 bg-red4 hover:bg-red5 focus:shadow-red7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none outline-none focus:shadow-[0_0_0_2px]">
          Confirm
        </button>
      </AlertDialog.Action>
    </>
  );

  // ===================================================
  // Document removal
  // ===================================================
  const deleteDocuments = async () => {
    if (selectedDocuments.size === 0) return;

    setModalState({
      open: true,
      title: 'Confirm deletion',
      description: `This action cannot be reverted. Are you want to delete selected document${
        selectedDocuments.size > 1 ? 's' : ''
      }?`,
      type: ModalType.Alert
    });
  };

  const selectAllDocuments = (selectAll: boolean) => {
    if (selectAll) {
      setSelectedDocuments(
        new Set<number>(documents.map((document) => document.id))
      );
    } else {
      setSelectedDocuments(new Set<number>());
    }
  };

  // ===================================================
  // Get number of documents per page based on window height
  // ===================================================
  const displayOptions: DocumentsPerPage[] = ['5', '10', '15', '20'];
  const [documentsPerPage, setDocumentsPerPage] =
    useState<DocumentsPerPage>('5');
  const selectDocumentsPerPage = useCallback(
    (value: string) => setDocumentsPerPage(value as DocumentsPerPage),
    []
  );

  // ===================================================
  // Document filter and sorting
  // ===================================================
  const handleColumnClick = useCallback(
    (column: number) => {
      if (sortByColumn !== column) {
        setSortByColumn(column);
        setSortAscending(true);
      } else {
        setSortAscending((prevState) => !prevState);
      }
    },
    [sortByColumn, setSortAscending]
  );

  const sortAndFilterDocuments = (documents: Document[]) => {
    const filteredDocuments = documents.filter((document) =>
      document.name.toLowerCase().includes(filter.trim().toLowerCase())
    );
    if (sortByColumn !== null) {
      filteredDocuments.sort((a, b) => {
        let returnValue;
        switch (sortByColumn) {
          case Columns.name:
            returnValue =
              a.name.split('/').pop()! > b.name.split('/').pop()! ? 1 : -1;
            break;
          case Columns.size:
            returnValue = a.metadata.size > b.metadata.size ? 1 : -1;
            break;
          case Columns.kind:
            returnValue =
              FileType(a.metadata.mimetype) > FileType(b.metadata.mimetype)
                ? 1
                : -1;
            break;
          case Columns.dateUploaded:
            returnValue =
              new Date(a.metadata.lastModified) >
              new Date(b.metadata.lastModified)
                ? 1
                : -1;
            break;
          case Columns.status:
            returnValue = (a.status ?? '') > (a.status ?? '') ? 1 : -1;
            break;
          default:
            return new Date(a.metadata.lastModified) >
              new Date(b.metadata.lastModified)
              ? -1
              : 1;
        }
        return sortAscending ? returnValue : returnValue * -1;
      });
    }
    return filteredDocuments;
  };

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
      return documentPages[adjustedPageIndex].map((document) => (
        <DocumentRow
          key={document.id}
          doc={document}
          selected={selectedDocuments.has(document.id)}
          loading={
            (deletingDocuments && selectedDocuments.has(document.id)) ||
            fetchingDocuments
          }
          setSelectedDocuments={onDocumentSelect}
          columnWidths={ColumnWidths}
        />
      ));
    } else {
      return documentPages[currentPage].map((document) => (
        <DocumentRow
          key={document.id}
          doc={document}
          selected={selectedDocuments.has(document.id)}
          loading={
            (deletingDocuments && selectedDocuments.has(document.id)) ||
            fetchingDocuments
          }
          setSelectedDocuments={onDocumentSelect}
          columnWidths={ColumnWidths}
        />
      ));
    }
  };

  // ===================================================
  // Find documents to display by applying filter and sorting
  // ===================================================
  const documentPages = useMemo(() => {
    const sortedAndFilteredDocuments = sortAndFilterDocuments(documents);
    return splitArray(sortedAndFilteredDocuments, parseInt(documentsPerPage));
  }, [
    documents,
    filter,
    sortByColumn,
    sortAscending,
    selectedDocuments,
    documentsPerPage
  ]);
  const totalPages = documentPages.length;
  const displayedDocuments = useMemo(
    () => selectDisplayedDocuments(documentPages, totalPages),
    [documentPages, totalPages, currentPage]
  );

  // ===================================================
  // Tailwind Classes
  // ===================================================
  const paginationButtonClasses = classNames(
    'flex items-center px-3.5 py-1.5 text-base text-gray-500 hover:text-gray-700',
    'bg-white dark:bg-neutral5 border rounded-md gap-x-2',
    'hover:bg-gray-100 dark:bg-zinc-900 dark:text-gray-600 dark:hover:text-white',
    'dark:border-gray-700 dark:hover:bg-zinc-700 cursor-pointer',
    'transition duration-125 shadow-sm border-gray-200 dark:border-zinc-700'
  );

  // ===================================================
  // Document removal button passed to the table header
  // ===================================================
  const FileListControls = (
    <>
      <AnimatePresence>
        <SettingsDropdown
          displayOptions={displayOptions}
          documentsPerPage={documentsPerPage}
          selectDocumentsPerPage={selectDocumentsPerPage}
          sortByColumn={sortByColumn}
          sortAscending={sortAscending}
          handleColumnClick={handleColumnClick}
        />
        {selectedDocuments.size > 0 && (
          <motion.button
            className={classNames(
              'font-semibold text-white text-sm inline-flex',
              'items-center justify-center bg-red-500 hover:bg-red-500/[0.9] cursor-pointer outline-none',
              'border border-red-400',
              'transition duration-150 shadow-sm gap-x-1.5',
              'w-9 h-9 rounded-full md:rounded-md md:w-auto md:h-auto md:px-3 md:py-1.5 '
            )}
            aria-label="Delete file(s)"
            key={'FileDeleteButton'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={deleteDocuments}
          >
            <TrashIcon className="w-4 h-4" />
            <span className={'hidden md:inline-block'}>Delete</span>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );

  return (
    <>
      {modalState && (
        <AlertModal
          modalState={modalState}
          setModalState={setModalState}
          actionButtons={ModalActionButtons}
        />
      )}
      <div className={'w-full'}>
        <table
          className={classNames(
            'block w-full mt-0 pt-2 pb-9 px-6 lg:px-16 min-h-full relative'
          )}
        >
          <TableHeader
            setFilter={selectFilter}
            sortByColumn={sortByColumn}
            sortAscending={sortAscending}
            handleColumnClick={handleColumnClick}
            allDocumentsSelected={
              documents.length > 0 &&
              selectedDocuments.size === documents.length
            }
            selectAllDocuments={selectAllDocuments}
            controls={FileListControls}
            columnWidths={ColumnWidths}
          />
          <tbody
            className={classNames(
              'mt-0 flex flex-col w-full',
              'gap-y-1 pt-2 table-layout:gap-y-0 table-layout:pt-0 table-layout:divide-y',
              'divide-gray-200 dark:divide-zinc-700 relative overflow-y-scroll scrollbar-hide'
            )}
          >
            {displayedDocuments.length > 0 ? (
              displayedDocuments
            ) : (
              <tr className={'flex'}>
                <td
                  className={
                    'px-4 py-5 text-sm lg:text-base text-gray-700 w-full'
                  }
                >
                  <h2 className="font-normal text-gray-800 dark:text-white">
                    No data to display.
                  </h2>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {/* Pagination buttons */}
        <div className="absolute bottom-4 left-0 flex items-center justify-between px-8 w-full">
          <button
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 0) {
                setCurrentPage(currentPage - 1);
              }
            }}
            className={classNames(
              paginationButtonClasses,
              totalPages > 1 && currentPage > 0 ? 'opacity-100' : 'opacity-0'
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
              />
            </svg>
            <span className="sr-only">Previous page</span>
          </button>

          <PageIndex
            totalPages={totalPages}
            setPage={setCurrentPage}
            currPage={currentPage}
          />

          <button
            onClick={() => {
              if (currentPage < totalPages - 1) {
                setCurrentPage(currentPage + 1);
              }
            }}
            className={classNames(
              paginationButtonClasses,
              totalPages > 1 && currentPage < totalPages - 1
                ? 'opacity-100'
                : 'opacity-0'
            )}
          >
            <span className={'sr-only'}>Next page</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
              />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
