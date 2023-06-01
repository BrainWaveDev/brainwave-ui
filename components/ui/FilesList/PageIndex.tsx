import { Dispatch, SetStateAction } from 'react';
import classNames from 'classnames';

interface Props {
  totalPages: number;
  setPage: Dispatch<SetStateAction<number>>;
  currPage: number;
}

export default function PageIndex({ totalPages, setPage, currPage }: Props) {
  const pageNumberBox = (pageNumber: number, selected: boolean) => {
    return (
      <button
        key={`page-${pageNumber}`}
        className={classNames(
          'px-2.5 py-1 text-base text-teal-400 dark:text-gray-400 rounded-md',
          'cursor-pointer hover:text-teal-600 dark:hover:text-white',
          selected &&
            'bg-teal-200/75 text-teal-500 dark:bg-neutral5 dark:text-white'
        )}
        onClick={(e) => {
          e.preventDefault();
          setPage(pageNumber);
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

  if (totalPages <= 5) {
    // display all page numbers
    return (
      <div className="items-center gap-x-3">
        {Array.from(Array(totalPages).keys()).map((pageNumber) => {
          return pageNumberBox(pageNumber, pageNumber === currPage);
        })}
      </div>
    );
  } else {
    // display first page, last page, selected index, and ellipses
    const isFirstPageSelected = currPage === 0;
    const isLastPageSelected = currPage === totalPages - 1;
    const pages = [
      pageNumberBox(0, isFirstPageSelected),
      !isFirstPageSelected && currPage - 1 >= 1 ? ellipsis() : null,
      isFirstPageSelected || isLastPageSelected
        ? null
        : pageNumberBox(currPage, true),
      !isLastPageSelected && totalPages - currPage > 2 ? ellipsis() : null,
      pageNumberBox(totalPages - 1, isLastPageSelected)
    ].filter(Boolean); // Remove null values from the array

    return <div className="items-center flex gap-x-3">{pages}</div>;
  }
}
