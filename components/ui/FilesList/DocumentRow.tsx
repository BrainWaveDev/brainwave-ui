import { Document } from '../../../types';
import React, { ForwardedRef, memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotatingLines } from 'react-loader-spinner';
import classNames from 'classnames';
import { DocumentTextIcon } from '@heroicons/react/24/solid';
import { FileType } from '@/components/ui/FilesList/FilesList';
import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDownIcon } from '@radix-ui/react-icons';

function DocumentRow({
  doc,
  selected,
  loading,
  setSelectedDocuments,
  columnWidths
}: {
  doc: Document;
  selected: boolean;
  loading: boolean;
  setSelectedDocuments: (documentId: number) => void;
  columnWidths: { [_: string]: string };
}) {
  // Helper functions to format data
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

  // Cache the formatted data
  const [docSize, docType, docDateUploaded] = useMemo(() => {
    const docSize = formatBytes(doc.metadata.size);
    const docType = FileType(doc.metadata.mimetype);
    const docDateUploaded = formatDate(doc.metadata.lastModified);

    return [docSize, docType, docDateUploaded];
  }, [doc]);

  // Styling of select all document checkbox
  const selectAllDocumentsCheckboxStyle = classNames(
    'mr-2 text-teal-400 border-gray-300 rounded cursor-pointer',
    'focus:outline-0 active:outline-0 focus:ring-teal-400',
    'bg-white dark:bg-zinc-600 dark:border-zinc-600 dark:focus:ring-white dark:focus:ring-0',
    'dark:focus:outline-0 w-3 h-3 md:w-4 md:h-4'
  );

  return (
    <AnimatePresence>
      {loading ? (
        <motion.tr
          key={'loading_' + doc.id}
          initial={{ opacity: 0, display: 'none' }}
          animate={{ opacity: 1, display: 'flex' }}
          exit={{ opacity: 0, display: 'none' }}
          transition={{ duration: 0.5 }}
        >
          <td className={'w-full'}>
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
      ) : (
        <motion.tr
          key={doc.id}
          initial={{ opacity: 0, display: 'none' }}
          animate={{ opacity: 1, display: 'flex' }}
          exit={{ opacity: 0, display: 'none' }}
          transition={{ duration: 0 }}
          className={'bg-transparent'}
        >
          {/* According element is used to display information about each document */}
          <td className={'w-full block table-layout:hidden'}>
            <Accordion.Root
              className={classNames(
                'w-full rounded-md border border-gray-200 dark:border-zinc-700 my-0.5',
                'overflow-hidden'
              )}
              type="single"
              defaultValue="item-1"
              collapsible
            >
              <AccordionItem value={doc.id}>
                <AccordionTrigger>
                  <div className="flex items-center gap-x-3 w-[90%] cursor-pointer">
                    <input
                      type="checkbox"
                      className={selectAllDocumentsCheckboxStyle}
                      checked={selected}
                      onClick={(event) => event.stopPropagation()}
                      onChange={(_) => setSelectedDocuments(doc.id)}
                    />
                    <div className="flex items-center gap-x-2 max-w-[85%] group">
                      <div className="flex items-center w-5 h-5 text-teal-400 rounded-full md:mr-1">
                        <DocumentTextIcon className="w-4 h-4 md:w-5 md:h-5 fill-teal-400" />
                      </div>
                      <p
                        className={classNames(
                          'inline leading-5 m-0 max-w-full overflow-ellipsis whitespace-nowrap overflow-hidden',
                          'text-gray-700 dark:text-gray-100 group-hover:text-teal-400 cursor-pointer'
                        )}
                      >
                        {doc.name}
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div
                    className={classNames(
                      'grid grid-cols-2 grid-rows-4 px-2 gap-y-1 text-sm',
                      'children-even:text-zinc-800 children-even:font-semibold',
                      'dark:children-even:text-gray-300'
                    )}
                  >
                    <p>Size</p>
                    <p className={'text-right'}>{docSize}</p>
                    <p>Kind</p>
                    <p className={'text-right'}>{docType}</p>
                    <p>Date Uploaded</p>
                    <p className={'text-right'}>{docDateUploaded}</p>
                    <p>Status</p>
                    <div
                      className={
                        'flex flex-row gap-x-1.5 items-center justify-end w-full'
                      }
                    >
                      {doc.status && (
                        <>
                          <div
                            className={classNames(
                              'h-2 w-2 md:w-2.5 md:h-2.5 rounded-full',
                              doc.status == 'Parsed' && 'bg-green-400',
                              doc.status == 'Parsing' && 'bg-yellow-400',
                              doc.status == 'Error' && 'bg-red-500'
                            )}
                          />
                          {doc.status}
                        </>
                      )}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion.Root>
          </td>
          <td
            className={classNames(
              'hidden table-layout:block px-4 py-5 text-xs md:text-sm lg:text-base my-auto font-medium',
              columnWidths.name
            )}
          >
            <div className="flex items-center gap-x-3 w-full">
              <input
                type="checkbox"
                className={selectAllDocumentsCheckboxStyle}
                checked={selected}
                onChange={(_) => setSelectedDocuments(doc.id)}
              />

              <div
                className="flex items-center gap-x-2 max-w-[85%] group"
                onClick={() => setSelectedDocuments(doc.id)}
              >
                <div className="flex items-center w-5 h-5 text-teal-400 rounded-full md:mr-1">
                  <DocumentTextIcon className="w-4 h-4 md:w-5 md:h-5 fill-teal-400" />
                </div>
                <p
                  className={classNames(
                    'inline m-0 max-w-full overflow-ellipsis whitespace-nowrap overflow-hidden',
                    'text-gray-700 dark:text-gray-100 group-hover:text-teal-400 cursor-pointer'
                  )}
                >
                  {doc.name}
                </p>
              </div>
            </div>
          </td>
          <td
            className={classNames(
              'hidden table-layout:block py-5 text-xs md:text-sm lg:text-base my-auto font-normal text-gray-500 dark:text-gray-400',
              columnWidths.size
            )}
          >
            {docSize}
          </td>
          <td
            className={classNames(
              'hidden table-layout:block py-5 text-xs md:text-sm lg:text-base my-auto font-normal text-gray-500 dark:text-gray-400',
              columnWidths.kind
            )}
          >
            {docType}
          </td>
          <td
            className={classNames(
              'hidden table-layout:block py-5 text-xs md:text-sm lg:text-base my-auto font-normal text-gray-500 dark:text-gray-400',
              columnWidths.dateUploaded
            )}
          >
            {docDateUploaded}
          </td>
          <td
            className={classNames(
              'hidden table-layout:block py-5 text-xs md:text-sm lg:text-base my-auto font-normal text-gray-500 dark:text-gray-300',
              columnWidths.status
            )}
          >
            <div className={'flex flex-row gap-x-1.5 items-center w-fit'}>
              {doc.status && (
                <>
                  <div
                    className={classNames(
                      'h-2 w-2 md:w-2.5 md:h-2.5 rounded-full',
                      doc.status == 'Parsed' && 'bg-green-400',
                      doc.status == 'Parsing' && 'bg-yellow-400',
                      doc.status == 'Error' && 'bg-red-500'
                    )}
                  />
                  {doc.status}
                </>
              )}
            </div>
          </td>
        </motion.tr>
      )}
    </AnimatePresence>
  );
}

export default memo(DocumentRow);

const AccordionItem = React.forwardRef(
  (
    {
      children,
      className,
      value,
      ...props
    }: {
      children: React.ReactNode;
      className?: string;
      value?: any;
    },
    forwardedRef: ForwardedRef<HTMLDivElement>
  ) => (
    <Accordion.Item
      className={classNames('', className)}
      {...props}
      ref={forwardedRef}
      value={value}
    >
      {children}
    </Accordion.Item>
  )
);

const AccordionTrigger = React.forwardRef(
  (
    {
      children,
      className,
      ...props
    }: {
      children: React.ReactNode;
      className?: string;
    },
    forwardedRef: ForwardedRef<HTMLButtonElement>
  ) => (
    <Accordion.Header className="flex">
      <Accordion.Trigger
        className={classNames(
          'text-gray-400 group flex h-fit py-3 flex-1 cursor-default max-w-full',
          'items-center justify-between bg-transparent px-5 text-[15px] leading-none outline-none',
          className
        )}
        {...props}
        ref={forwardedRef}
      >
        {children}
        <ChevronDownIcon
          className={classNames(
            'h-4 w-4 text-teal-400 dark:text-teal-500',
            'transition-transform duration-300 group-data-[state=open]:rotate-180'
          )}
          aria-hidden
        />
      </Accordion.Trigger>
    </Accordion.Header>
  )
);

const AccordionContent = React.forwardRef(
  (
    {
      children,
      className,
      ...props
    }: {
      children: React.ReactNode;
      className?: string;
    },
    forwardedRef: ForwardedRef<HTMLDivElement>
  ) => (
    <Accordion.Content
      className={classNames(
        'text-mauve11 bg-gray-100 dark:bg-zinc-900 data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden text-[15px]',
        className
      )}
      {...props}
      ref={forwardedRef}
    >
      <div className="py-[15px] px-5">{children}</div>
    </Accordion.Content>
  )
);
