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
    <div
      className={classNames(
        'sm:absolute sm:top-0 left-0 right-0 z-10 py-4 flex items-center place-content-center',
        'bg-transparent border-nonerelative sticky top-4',
        // I think this looks slightly better, as leaving a large amount of space to just a single button would look weird
        // 'shadow-[0_0_8px_rgba(0,0,0,0.08)] border-black/10 border-b' 
      )}
    >
      <Popover.Root>
        <Popover.Trigger asChild>
          <button
            className={classNames(
              classes.filterButton,
              documents.length > 0
                ? 'cursor-pointer hover:bg-teal-50 active:bg-teal-50'
                : 'cursor-not-allowed opacity-75',
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
              'relative rounded-md z-10 px-5 pt-5 w-96 bg-white',
              'shadow-[0_10px_20px_-5px_hsla(206,22%,7%,.35),0_10px_10px_-15px_hsla(206,22%,7%,.2)]',
              'will-change-[transform,opacity] data-[state=open]:data-[side=top]:animate-slideDownAndFade',
              'data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade focus:ring-0'
            )}
            sideOffset={10}
            onCloseAutoFocus={() => setSearchString('')}
          >
            <div className="flex flex-col">
              <div className="flex flex-row items-center justify-between mt-4">
                <p className="text-mauve12 text-[15px] leading-[19px] font-medium">
                  Documents
                </p>
                <div className={'flex flex-row items-center gap-x-2'}>
                  <button
                    className={classNames(
                      'rounded-lg text-xs w-12 py-1 inline-flex shadow hover:bg-teal-50 active:bg-teal-50',
                      'items-center justify-center text-gray-600 cursor-pointer outline-none',
                      'transition duration-150 border border-gray-100'
                    )}
                    aria-label="Disselect all documents"
                    onClick={() => dispatch(clearSearchSpace())}
                  >
                    None
                  </button>
                  <button
                    className={classNames(
                      'rounded-lg text-xs w-10 py-1 inline-flex shadow hover:bg-teal-50 active:bg-teal-50',
                      'items-center justify-center text-gray-600 cursor-pointer outline-none',
                      'transition duration-150 border border-gray-100'
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
              <fieldset className="flex gap-5 items-center mt-3 relative">
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
                  className="w-full inline-flex pl-8 items-center justify-center flex-1 rounded-md px-2.5 text-sm leading-none text-gray-800 h-8 border border-gray-300 placeholder:text-gray-400 outline-none"
                  id="width"
                  placeholder="Search documents"
                  onInput={(e) => setSearchString(e.currentTarget.value)}
                />
              </fieldset>
              <div
                className={classNames(
                  'flex flex-col items-start mt-4 -mx-5 max-h-56 overflow-y-scroll',
                  classes['shadow-inset-top-bottom']
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
                  <p className={'text-sm text-gray-700 pl-5 py-2'}>
                    No documents match the search criteria.
                  </p>
                )}
              </div>
            </div>
            {documents.length > 0 && (
              <p
                className={
                  'text-xs text-gray-500 mx-auto text-center mt-3 pb-2'
                }
              >
                {searchSpace.length === documents.length
                  ? 'Results will be based on all documents.'
                  : searchSpace.length === 0
                  ? 'Results will be based on general knowledge.'
                  : 'Results will be based on the selected documents.'}
              </p>
            )}
            <Popover.Close
              className="rounded-full h-6 w-6 inline-flex items-center justify-center text-teal-500 absolute top-[5px] right-[5px] hover:bg-teal-50 focus:shadow-[0_0_0_2px] focus:shadow-teal-50 outline-none cursor-pointer"
              aria-label="Close"
            >
              <Cross2Icon />
            </Popover.Close>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
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
        className="flex items-center place-content-between w-full py-2 hover:bg-teal-50 px-5 cursor-pointer z-[5]"
        onClick={() => onSelectedChange(document.id)}
      >
        <div className={'flex flex-row items-center gap-x-2'}>
          <div className="flex items-center w-6 h-6 fill-teal-400 bg-teal-50 rounded-full">
            <DocumentTextIcon
              strokeWidth="1.5"
              className="w-5 h-5 mx-auto fill-teal-400"
              fill={'fill-teal-400'}
            />
          </div>
          <h2
            className={classNames(
              'text-sm text-gray-800 dark:text-white',
              selected ? 'font-semibold' : 'font-normal',
              'truncate'
            )}
          >
            {document.name}
          </h2>
        </div>
        <Checkbox.Root
          className="shadow-blackA7 hover:bg-teal-50 flex h-5 w-5 appearance-none items-center justify-center rounded-[4px] bg-white shadow outline-none focus:ring-0"
          id="c1"
          checked={selected}
          onCheckedChange={(checked) => {
            if (typeof checked === 'boolean') {
              onSelectedChange(document.id);
            }
          }}
        >
          <Checkbox.Indicator className="text-teal-400">
            <CheckIcon />
          </Checkbox.Indicator>
        </Checkbox.Root>
      </div>
    );
  }
);
