import React, { memo } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import classNames from 'classnames';
import {
  MixerHorizontalIcon,
  Cross2Icon,
  DotFilledIcon,
  TextAlignTopIcon,
  TextAlignBottomIcon
} from '@radix-ui/react-icons';
import { DocumentsPerPage } from '@/components/ui/FilesList/FilesList';

const SettingsDropdown = ({
  displayOptions,
  documentsPerPage,
  selectDocumentsPerPage,
  sortByColumn,
  sortAscending,
  handleColumnClick
}: {
  displayOptions: DocumentsPerPage[];
  documentsPerPage: DocumentsPerPage;
  selectDocumentsPerPage: (value: string) => void;
  sortByColumn: number | null;
  sortAscending: boolean;
  handleColumnClick: (column: number) => void;
}) => {
  // Manage menu state
  const [open, setOpen] = React.useState(false);
  const toggleOpen = (state: boolean) => setOpen(state);

  const columns = ['Name', 'Size', 'Type', 'Date Uploaded', 'Status'];

  const dropdownContentClasses = classNames(
    'relative z-20 w-48 md:w-56 bg-white px-1.5 py-2 shadow-lg',
    'dark:bg-zinc-700',
    'rounded-lg border border-gray-200 dark:border-zinc-700',
    'will-change-[opacity,transform]',
    'data-[side=top]:animate-slideDownAndFade',
    'data-[side=right]:animate-slideLeftAndFade',
    'data-[side=bottom]:animate-slideUpAndFade',
    'data-[side=left]:animate-slideRightAndFade'
  );

  return (
    <DropdownMenu.Root modal={false} open={open} onOpenChange={toggleOpen}>
      <DropdownMenu.Trigger asChild>
        <button
          className={classNames(
            'rounded-full w-9 h-9 inline-flex items-center justify-center',
            'text-gray-800 bg-white shadow-sm border border-gray-200 outline-none hover:bg-teal-50/50',
            'dark:text-white dark:border-zinc-600 dark:bg-zinc-700 dark:hover:bg-zinc-600'
          )}
          aria-label="Customise display and sorting options"
        >
          <MixerHorizontalIcon />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className={dropdownContentClasses}
          sideOffset={7}
          align={'start'}
        >
          <button
            className={classNames(
              'rounded-full h-6 w-6 inline-flex items-center justify-center text-gray-600 absolute',
              'top-[3px] right-[3px] hover:bg-gray-100 active:bg-gray-100 outline-none border-gray-200',
              'bg-white dark:bg-zinc-700 dark:border-zinc-500 dark:text-gray-400 dark:hover:text-gray-200',
              'dark:hover:bg-zinc-600 shadow-sm cursor-pointer'
            )}
            aria-label="Close"
            onClick={() => setOpen(false)}
          >
            <Cross2Icon />
          </button>
          <DropdownMenu.Label className="pl-2 mt-1 text-sm leading-7 text-gray-500 dark:text-gray-200">
            Documents per page
          </DropdownMenu.Label>
          <DropdownMenu.RadioGroup
            value={documentsPerPage}
            onValueChange={selectDocumentsPerPage}
            className={'flex flex-col md:pt-0.5'}
          >
            {displayOptions.map((value) => (
              <DropdownMenu.RadioItem
                className={classNames(
                  'text-sm leading-none text-teal-500 rounded-[3px] flex items-center h-[24px] px-[2px] relative',
                  'pl-3 select-none outline-none data-[disabled]:text-gray-100 data-[disabled]:pointer-events-none',
                  'dark:data-[disabled]:text-gray-400 dark:text-teal-400 dark:hover:text-gray-100',
                  'data-[highlighted]:bg-teal-400 data-[highlighted]:text-white cursor-pointer'
                )}
                value={value}
                key={value}
              >
                <DropdownMenu.ItemIndicator className="absolute right-1 w-[25px] inline-flex items-center justify-center">
                  <DotFilledIcon className={'h-4 w-4 md:w-5 md:h-5'} />
                </DropdownMenu.ItemIndicator>
                {value}
              </DropdownMenu.RadioItem>
            ))}
          </DropdownMenu.RadioGroup>
          <DropdownMenu.Separator className="block table-layout:hidden h-[1px] bg-gray-200 dark:bg-gray-500 mt-3 mb-2 mx-0.5" />
          <DropdownMenu.Label className="block table-layout:hidden pl-2 text-sm leading-7 text-gray-500 dark:text-gray-200">
            Sort by
          </DropdownMenu.Label>
          <DropdownMenu.RadioGroup
            value={sortByColumn !== null ? sortByColumn.toString() : undefined}
            onValueChange={(value) => handleColumnClick(parseInt(value))}
            className={'flex flex-col md:pt-0.5 block table-layout:hidden'}
          >
            {columns.map((name, index) => (
              <DropdownMenu.RadioItem
                className={classNames(
                  'text-sm leading-none text-teal-500 rounded-[3px] flex items-center h-[26px] px-[5px] relative',
                  'pl-3 select-none outline-none data-[disabled]:text-gray-100 data-[disabled]:pointer-events-none',
                  'dark:data-[disabled]:text-gray-400 dark:text-teal-400 dark:hover:text-gray-100',
                  'data-[highlighted]:bg-teal-400 data-[highlighted]:text-white cursor-pointer'
                )}
                value={index.toString()}
                key={'sort-by-' + columns[index]}
                aria-label={'Sort by ' + columns[index]}
              >
                {name}
                <DropdownMenu.ItemIndicator className="absolute right-2 w-[25px] h-[25px] inline-flex items-center justify-center">
                  <>
                    {sortAscending ? (
                      <TextAlignBottomIcon
                        className={'h-[25px] w-4 md:w-5 md:h-5 -mt-[4px]'}
                      />
                    ) : (
                      <TextAlignTopIcon
                        className={'h-[25px] w-4 md:w-5 md:h-5 mt-[4px]'}
                      />
                    )}
                    <span className="sr-only">Change sorting order</span>
                  </>
                </DropdownMenu.ItemIndicator>
              </DropdownMenu.RadioItem>
            ))}
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default memo(SettingsDropdown);
