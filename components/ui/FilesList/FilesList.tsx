import SearchIcon from '@/components/icons/SearchIcon';
import { Document } from '@/types/document';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import PageIndex from '@/components/ui/FileInput/PageIndex';
import React, { Dispatch, SetStateAction, useState } from 'react';
import TableHeader from '@/components/ui/FilesList/TableHeader';
import { RotatingLines } from 'react-loader-spinner';
import AlertModal, {
  ModalState,
  ModalType,
  setModalOpen
} from '@/components/ui/AlertModal';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import SelectBar, { SelectItem } from '../Select/Select';
import { useAppDispatch, useAppSelector } from 'context/redux/store';
import { optimisticDocumentActions } from 'context/redux/documentSlice';

const ONE_PAGE_SIZE = 5;

const FileType = (mimetype: string) => {
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

export default function FilesList() {
  const [currentPage, setCurrentPage] = useState(0);
  const [filter, setFilter] = useState('');
  const [sortByColumn, setSortByColumn] = useState<number | null>(null);
  const [sortAscending, setSortAscending] = useState(true);
  // List of document ids that were selected with input checkmarks in the document table
  const [selectedDocuments, setSelectedDocuments] = useState<Set<number>>(
    new Set<number>()
  );
  const [deletingDocuments, setDeletingDocuments] = useState(false);
  const [modalState, setModalState] = useState<ModalState | null>(null);
  const [smallScreenTableHeader, setSmallScreenTableHeader] = useState<SelectItem & { columnId: Columns }>({
    display: 'Status',
    value: 'Status',
    columnId: Columns.status
  });

  const documents = useAppSelector((state) => state.documents);
  const dispatch = useAppDispatch();

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
          setDeletingDocuments(true);
          dispatch(optimisticDocumentActions.deleteDocuments(Array.from(selectedDocuments)))
          setSelectedDocuments(new Set<number>());
          setDeletingDocuments(false);
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
      description: `This action cannot be reverted. Are you want to delete selected document${selectedDocuments.size > 1 ? 's' : ''
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
  // Document filter and sorting
  // ===================================================
  const handleColumnClick = (column: number) => {
    if (sortByColumn !== column) {
      setSortByColumn(column);
      setSortAscending(true);
    } else {
      setSortAscending((prevState) => !prevState);
    }
  };

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
      return documentPages[adjustedPageIndex].map((document) =>
        DocumentRow(
          document,
          selectedDocuments.has(document.id),
          deletingDocuments && selectedDocuments.has(document.id),
          setSelectedDocuments,
          smallScreenTableHeader.columnId
        )
      );
    } else {
      return documentPages[currentPage].map((document) =>
        DocumentRow(
          document,
          selectedDocuments.has(document.id),
          deletingDocuments && selectedDocuments.has(document.id),
          setSelectedDocuments,
          smallScreenTableHeader.columnId
        )
      );
    }
  };

  const sortedAndFilteredDocuments = sortAndFilterDocuments(documents);
  const documentPages = splitArray(sortedAndFilteredDocuments, ONE_PAGE_SIZE);
  const totalPages = documentPages.length;
  const displayedDocuments = selectDisplayedDocuments(
    documentPages,
    totalPages
  );



  const selectGroup: (SelectItem & { columnId: Columns })[] = [
    { display: 'Size', value: 'Size', columnId: Columns.size },
    { display: 'Kind', value: 'Kind', columnId: Columns.kind },
    { display: 'Date uploaded', value: 'Date uploaded', columnId: Columns.dateUploaded },
    { display: 'Status', value: 'Status', columnId: Columns.status }
  ]

  return (
    <>
      {modalState && (
        <AlertModal
          modalState={modalState}
          setModalState={setModalState}
          actionButtons={ModalActionButtons}
        />
      )}
      <section className="container px-4 mx-auto ">

        <div className='block sm:hidden'>
          <SelectBar groups={[{
            label: "Show Columns",
            items: selectGroup,
          }]}
            onValueChange={(value: string) => {
              setSmallScreenTableHeader(selectGroup.filter((item) => item.value === value)[0])
            }}
            defaulSelected={smallScreenTableHeader}
          />
        </div>


        <div className="flex items-center justify-between flex-row-reverse sm:flex-row">
          <div className={'flex items-center place-self-center'}>
            <AnimatePresence>
              {selectedDocuments.size > 0 && (
                <motion.button
                  className={classNames(
                    'font-semibold text-white rounded-lg text-sm px-3 py-1.5 inline-flex shadow',
                    'items-center justify-center bg-red-500 hover:bg-red-500/[0.9] cursor-pointer outline-none',
                    'transition duration-150'
                  )}
                  aria-label="Delete file(s)"
                  key={'FileDeleteButton'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={deleteDocuments}
                >
                  Delete
                </motion.button>
              )}
            </AnimatePresence>
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
                className="block p-2 pl-10 text-sm text-gray-700 border-none rounded-lg sm:w-80 bg-white shadow focus:ring-2 ring-teal-400 outline-none appearance-none"
                placeholder="Search for files"
                onChange={(e) => {
                  setFilter(e.target.value);
                }}
              />
            </div>
          </div>
        </div>



        <div className="flex flex-col mt-6 min-h-[47vh]">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg mx-[2vw] sm:mx-0 rounded-md">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 table-fixed ">
                  <thead className="bg-gray-50 dark:bg-gray-800 ">
                    <TableHeader
                      sortByColumn={sortByColumn}
                      sortAscending={sortAscending}
                      handleColumnClick={handleColumnClick}
                      allDocumentsSelected={
                        documents.length > 0 &&
                        selectedDocuments.size === documents.length
                      }
                      selectAllDocuments={selectAllDocuments}
                      smallScreenSelectedColumn={smallScreenTableHeader}
                    />
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
            <span
              className='hidden sm:inline-block'
            >
              Previous</span>
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
            <span
              className='hidden sm:inline-block'
            >Next
            </span>
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
    </>
  );
}

function DocumentRow(
  doc: Document,
  selected: boolean,
  loading: boolean,
  setSelectedDocuments: Dispatch<SetStateAction<Set<number>>>,
  selectedSmallScreenColumn: Columns,
) {

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
    return `${month} ${day}, ${year}`;
  };

  const selectDocument = (select: boolean, documentId: number) => {
    setSelectedDocuments((selectedDocuments) => {
      if (selectedDocuments.has(documentId)) {
        selectedDocuments.delete(documentId);
      } else {
        selectedDocuments.add(documentId);
      }
      return new Set(selectedDocuments);
    });
  };

  const LoadingRow = (
    <motion.tr
      key={'loading_' + doc.id}
      initial={{ opacity: 0, display: 'none' }}
      animate={{ opacity: 1, display: 'table-row' }}
      exit={{ opacity: 0, display: 'none' }}
      transition={{ duration: 0.5 }}
    >
      <td colSpan={1000}>
        <div
          className={
            'h-fit py-3.5 w-full flex items-center place-content-center'
          }
        >
          <RotatingLines
            strokeColor="#9ca3af"
            strokeWidth="2"
            animationDuration="1"
            width="2.15rem"
            visible={true}
          />
        </div>
      </td>
    </motion.tr>
  );

  if (loading) {
    return LoadingRow;
  } else
    return (
      <motion.tr
        key={doc.id}
        initial={{ opacity: 0, display: 'none' }}
        animate={{ opacity: 1, display: 'table-row' }}
        exit={{ opacity: 0, display: 'none' }}
        transition={{ duration: 0.5 }}
        onClick={() => {
          //if on small screen,
          if (window.innerWidth < 640) {
            selectDocument(!selected, doc.id)
          }
        }}
        // TODO: this need to be more visually confortable
        className={` ${selected ? 'bg-gray-100 dark:bg-gray-800 shadow-[inset_0px_0px_0px_4px] shadow-cyan-500' : ''} sm:shadow-none sm:bg-white`}
      >
        <td className="inline-block px-4 py-4 sm:w-[33rem] w-[50vw] 
        overflow-ellipsis text-sm font-medium text-gray-700 whitespace-nowrap overflow-hidden">
          <div className="inline-flex items-center gap-x-3">
            <input
              type="checkbox"
              className={classNames(
                'mr-2 text-teal-400 border-gray-300 rounded cursor-pointer',
                'focus:outline-teal-400 active:outline-teal-400 hidden sm:inline-block'
              )}
              checked={selected}
              onChange={(event) => selectDocument(event.target.checked, doc.id)}
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

        <Td showOnSmall={selectedSmallScreenColumn === Columns.size}>
          {formatBytes(doc.metadata.size)}
        </Td>

        <Td showOnSmall={selectedSmallScreenColumn === Columns.kind}>
          {FileType(doc.metadata.mimetype)}
        </Td>

        <Td showOnSmall={selectedSmallScreenColumn === Columns.dateUploaded}>
          {formatDate(doc.metadata.lastModified)}
        </Td>

        <Td showOnSmall={selectedSmallScreenColumn === Columns.status}>
          <div className={'flex flex-row gap-x-1.5 items-center'}>
            {doc.status && (
              <>
                <div
                  className={classNames(
                    'w-2.5 h-2.5 rounded-full',
                    doc.status == 'Parsed' && 'bg-green-400',
                    doc.status == 'Parsing' && 'bg-yellow-400',
                    doc.status == 'Error' && 'bg-red-500'
                  )}
                />
                {doc.status}
              </>
            )}
          </div>
        </Td>

      </motion.tr>
    );

  function Td({ children,showOnSmall }: { children?: React.ReactNode,showOnSmall:boolean }) {
    return (
      <td className={`px-4 py-4 w-48 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap sm:table-cell ${showOnSmall?"":"hidden"}`}>
        {children}
      </td>
    );
  }
}
