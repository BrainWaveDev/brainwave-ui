import React, { memo, useMemo, useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { Cross2Icon, MixerHorizontalIcon } from '@radix-ui/react-icons';
import classes from './Chat.module.css';
import { Document } from '@/types/document';
import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon } from '@radix-ui/react-icons';
import classNames from 'classnames';
import { useAppDispatch } from 'context/redux/store';
import {
  clearSearchSpace,
  getSearchSpaceFromStore,
  selectAllSearchSpace,
  selectSearchSpace
} from 'context/redux/searchSpaceSlice';
import { DocumentTextIcon } from '@heroicons/react/24/solid';
import { getDocumentsFromStore } from '../../context/redux/documentSlice';

export default function DocumentFilter() {
  // ===========================
  // Redux Store
  // ===========================
  const dispatch = useAppDispatch();
  const documents = getDocumentsFromStore();
  const searchSpace = getSearchSpaceFromStore();

  // ===========================
  // Filter state
  // ===========================
  // Manage state of document filter locally on small screens
  const [documentFilterOpen, setDocumentFilterOpen] = useState(false);
  const [searchString, setSearchString] = useState('');
  const allDocumentIds = useMemo(
    () => documents.map((doc) => doc.id),
    [documents]
  );
  const filteredDocuments = useMemo(
    () => documents.filter((document) => document.name.includes(searchString)),
    [documents, searchString]
  );

  return (
    <>
      <div
        // Document filter rendered on small screens
        className={classNames(
          'z-10 w-full h-full flex lg:hidden items-center place-content-center py-2',
          'bg-transparent border-nonerelative',
          'bg-white dark:bg-neutral6 border-b border-gray-200 dark:border-zinc-700',
          !documentFilterOpen &&
            'shadow-[0_0.75rem_2.5rem_-0.75rem_rgba(0,0,0,0.06)] dark:shadow-[0_0.75rem_2.5rem_-0.75rem_rgba(0,0,0,0.15)]'
        )}
      >
        <Popover.Root
          open={documentFilterOpen}
          onOpenChange={(state) => setDocumentFilterOpen(state)}
        >
          <Popover.Trigger asChild>
            <button
              className={classNames(
                classes.filterButton,
                'cursor-pointer hover:bg-neutral2 active:bg-gray-100',
                'bg-white border border-gray-100 dark:bg-zinc-700 dark:border-zinc-700',
                'text-gray-700 hover:text-gray-700 dark:text-gray-100 hover:dark:bg-zinc-600',
                'active:text-gray-700 dark:active:text-gray-100'
              )}
              aria-label="Filter documents"
              disabled={documents.length === 0}
            >
              <MixerHorizontalIcon />
              Filter documents
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              className={classNames(
                'z-20 rounded-md pt-5 w-96 max-w-[90vw] bg-white dark:bg-zinc-700',
                'shadow-[0_10px_20px_-5px_hsla(206,22%,7%,.35),0_10px_10px_-15px_hsla(206,22%,7%,.2)]',
                'will-change-[transform,opacity] data-[state=open]:data-[side=top]:animate-slideDownAndFade',
                'data-[state=open]:data-[side=right]:animate-slideLeftAndFade',
                'data-[state=open]:data-[side=bottom]:animate-slideUpAndFade',
                'data-[state=open]:data-[side=left]:animate-slideRightAndFade focus:ring-0'
              )}
              sideOffset={15}
              onCloseAutoFocus={() => setSearchString('')}
              side={'bottom'}
            >
              <div className="flex flex-col">
                <div className="flex flex-row items-center justify-between mt-4 ml-6 mr-5">
                  <p className="text-gray-800 dark:text-gray-100 text-base leading-[19px] font-medium">
                    Documents
                  </p>
                  <div className={'flex flex-row items-center gap-x-2'}>
                    <button
                      className={classNames(
                        'rounded-lg text-xs w-12 py-1 inline-flex shadow hover:bg-gray-100 active:bg-gray-100',
                        'items-center justify-center text-gray-600 dark:text-white cursor-pointer outline-none',
                        'transition duration-150 border border-gray-100 dark:border-zinc-700 dark:bg-zinc-600',
                        'dark:hover:bg-zinc-500 dark:active:bg-zinc-500'
                      )}
                      aria-label="Disselect all documents"
                      onClick={() => dispatch(clearSearchSpace())}
                    >
                      None
                    </button>
                    <button
                      className={classNames(
                        'rounded-lg text-xs w-10 py-1 inline-flex shadow hover:bg-gray-100 active:bg-gray-100',
                        'items-center justify-center text-gray-600 dark:text-white cursor-pointer outline-none',
                        'transition duration-150 border border-gray-100 dark:border-zinc-700 dark:bg-zinc-600',
                        'dark:hover:bg-zinc-500 dark:active:bg-zinc-500'
                      )}
                      aria-label="Select all documents"
                      onClick={() =>
                        dispatch(selectAllSearchSpace(allDocumentIds))
                      }
                    >
                      All
                    </button>
                  </div>
                </div>
                <fieldset className="flex gap-5 items-center mt-3 relative mx-5">
                  <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none pl-2">
                    <svg
                      className="h-4 w-4 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                    </svg>
                  </div>
                  <input
                    className={classNames(
                      'w-full inline-flex pl-8 items-center justify-center flex-1 rounded-lg px-2.5 text-sm',
                      'leading-none text-gray-800 h-8 border border-gray-300 placeholder:text-gray-400 outline-none',
                      'dark:bg-zinc-600 dark:border-zinc-700 dark:text-gray-100 dark:placeholder-gray-400'
                    )}
                    id="width"
                    placeholder="Search documents"
                    onInput={(e) => setSearchString(e.currentTarget.value)}
                  />
                </fieldset>
                <div className="flex justify-center align-middle">
                  <div
                    className={classNames(
                      'flex flex-col items-start mt-4 -mx-5 max-h-56 overflow-y-scroll w-full max-w-full scrollbar-hide',
                      'dark:bg-neutral7/20',
                      'shadow-[inset_0_5px_3px_-5px_rgba(0,0,0,0.15),inset_0_-5px_3px_-5px_rgba(0,0,0,0.15)]',
                      'dark:border-t dark:border-zinc-700'
                    )}
                  >
                    {filteredDocuments.length > 0 &&
                      filteredDocuments.map((document, index) => (
                        <DocumentRow
                          document={document}
                          selected={searchSpace.includes(document.id)}
                          onSelectedChange={() => {
                            dispatch(selectSearchSpace(document.id));
                          }}
                          key={index}
                        />
                      ))}
                    {filteredDocuments.length == 0 && searchString !== '' && (
                      <p
                        className={
                          'text-sm text-gray-700 dark:text-gray-400 w-full text-center py-3'
                        }
                      >
                        No documents match the search criteria.
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <Popover.Close
                className={classNames(
                  'z-20 rounded-full h-6 w-6 inline-flex items-center justify-center text-gray-600 absolute',
                  'top-[5px] right-[5px] hover:bg-gray-100 active:bg-gray-100 outline-none border-gray-200',
                  'bg-white dark:bg-zinc-700 dark:border-zinc-500 dark:text-gray-400 dark:hover:text-gray-200 ',
                  'dark:active:text-gray-200 dark:hover:bg-zinc-600 dark:active:bg-zinc-600 cursor-pointer'
                )}
                aria-label="Close"
              >
                <Cross2Icon />
              </Popover.Close>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>
      <div
        // Document filter displayed on large screens
        className={classNames(
          'hidden lg:flex z-30 absolute top-0 right-0 bottom-0 flex-col',
          'rounded-r-[1.25rem] rounded-l-none shadow-[inset_0_1rem_2rem_rgba(0,0,0,0.01)]',
          'border-l border-gray-200 dark:border-zinc-700',
          'min-w-[20rem] max-w-[20rem] xl:min-w-[22.5rem] xl:max-w-[22.5rem]'
        )}
      >
        <header
          className={classNames(
            'text-gray-800 dark:text-white text-lg',
            'flex flex-row items-center justify-between min-h-[4.5rem] h-[4.5rem] py-3 sm:border-b',
            // 'border-gray-200 shadow-[0_0.75rem_2.5rem_-0.75rem_rgba(0,0,0,0.06)]',
            'dark:border-zinc-700 dark:shadow-[0_0.75rem_2.5rem_-0.75rem_rgba(0,0,0,0.15)]',
            'overflow-visible relative',
            'pl-8 sm:pr-6 font-semibold'
          )}
        >
          Filter Documents
        </header>
        <fieldset className="flex items-center my-5 relative w-4/5 ml-8">
          <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none pl-2">
            <svg
              className="h-4 w-4 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
            </svg>
          </div>
          <input
            className={classNames(
              'w-full inline-flex pl-8 items-center justify-center flex-1 px-2.5',
              'text-md leading-none text-gray-800 h-9 border border-gray-300 placeholder:text-gray-400 outline-none',
              'border-none placeholder:text-gray-400 placeholder:font-normal rounded-lg',
              'bg-gray-100/75 focus:outline-0 focus:ring-0 outline-none appearance-none',
              'dark:bg-zinc-700 dark:placeholder:text-gray-400 dark:text-white'
            )}
            id="width"
            placeholder="Search documents"
            onInput={(e) => setSearchString(e.currentTarget.value)}
          />
        </fieldset>
        <div className="flex justify-center align-middle max-w-full h-[calc(100%_-_9.25rem)] pb-[4.5rem]">
          <div
            className={classNames(
              'flex flex-col items-start -mx-5 overflow-y-scroll max-w-full scrollbar-hide w-full',
              'max-h-full dark:bg-neutral7/20',
              'shadow-[inset_0_5px_3px_-5px_rgba(0,0,0,0.15),inset_0_-5px_3px_-5px_rgba(0,0,0,0.15)]',
              'dark:border-y dark:border-zinc-700'
            )}
          >
            {filteredDocuments.length > 0 &&
              filteredDocuments.map((document, index) => (
                <DocumentRow
                  document={document}
                  selected={searchSpace.includes(document.id)}
                  onSelectedChange={() => {
                    dispatch(selectSearchSpace(document.id));
                  }}
                  key={index}
                />
              ))}
            {filteredDocuments.length == 0 && searchString !== '' && (
              <p
                className={
                  'text-sm text-gray-700 dark:text-gray-400 w-full text-center py-4'
                }
              >
                No documents match the search criteria.
              </p>
            )}
          </div>
        </div>
        <div
          className={
            'absolute bottom-0 left-0 right-0 flex grow flex-row items-center justify-center gap-x-2 w-full min-h-[4.5rem] h-[4.5rem]'
          }
        >
          <button
            className={classNames(
              'rounded-lg text-md py-1 px-4 inline-flex shadow hover:bg-gray-100 active:bg-gray-100',
              'items-center justify-center text-gray-600 dark:text-white cursor-pointer outline-none',
              'transition duration-150 border border-gray-100 dark:border-zinc-700 dark:bg-zinc-700',
              'dark:hover:bg-zinc-600 dark:active:bg-zinc-600'
            )}
            aria-label="Disselect all documents"
            onClick={() => dispatch(clearSearchSpace())}
          >
            None
          </button>
          <button
            className={classNames(
              'rounded-lg text-md py-1 px-4 inline-flex shadow hover:bg-gray-100 active:bg-gray-100',
              'items-center justify-center text-gray-600 dark:text-white cursor-pointer outline-none',
              'transition duration-150 border border-gray-100 dark:border-zinc-700 dark:bg-zinc-700',
              'dark:hover:bg-zinc-600 dark:active:bg-zinc-600'
            )}
            aria-label="Select all documents"
            onClick={() => dispatch(selectAllSearchSpace(allDocumentIds))}
          >
            All
          </button>
        </div>
      </div>
    </>
  );
}

const DocumentRow = memo(
  ({
    document,
    selected,
    onSelectedChange
  }: {
    document: Document;
    selected: boolean;
    onSelectedChange: (id: number) => void;
  }) => {
    return (
      <div
        className={classNames(
          'flex items-center place-content-between w-full py-2.5',
          'px-5 cursor-pointer z-[5] group',
          !selected && 'bg-gray-100/75 dark:bg-zinc-700'
        )}
        onClick={() => onSelectedChange(document.id)}
      >
        <div className={'inline-flex items-center gap-x-2 max-w-[90%]'}>
          <div className="flex items-center w-6 h-6 fill-teal-400 rounded-full">
            <DocumentTextIcon
              strokeWidth="1.5"
              className="w-5 h-5 mx-auto fill-teal-400"
              fill={'fill-teal-400'}
            />
          </div>
          <h2
            className={classNames(
              'text-sm transition-colors duration-150',
              selected
                ? 'text-gray-800 dark:text-white'
                : 'text-gray-500 dark:text-gray-400',
              'group-hover:text-teal-300',
              'overflow-hidden max-w-[80%]',
              'truncate text-ellipsis'
            )}
          >
            {document.name}
          </h2>
        </div>
        <Checkbox.Root
          className={classNames(
            'border text-teal-400 border-gray-300 rounded cursor-pointer',
            'focus:outline-0 active:outline-0 focus:ring-teal-400',
            'bg-white dark:bg-zinc-600 dark:border-zinc-600 dark:focus:ring-white dark:focus:ring-0',
            'dark:focus:outline-0 w-4 h-4'
          )}
          checked={selected}
          onCheckedChange={(checked) => {
            if (typeof checked === 'boolean') {
              onSelectedChange(document.id);
            }
          }}
          onClick={() => onSelectedChange(document.id)}
        >
          <Checkbox.Indicator className="text-teal-400">
            <CheckIcon />
          </Checkbox.Indicator>
        </Checkbox.Root>
      </div>
    );
  }
);
