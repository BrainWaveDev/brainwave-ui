import { Columns } from '@/components/ui/FilesList/FilesList';
import { TriangleDownIcon, TriangleUpIcon } from '@radix-ui/react-icons';
import classNames from 'classnames';
import { SelectItem } from '../Select/Select';

const ColumnName = ({
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
        'flex flex-row place-content-between items-center w-fit group cursor-pointer',
        'border border-opacity-0 border-gray-400 rounded-md hover:border-opacity-50 active:border-opacity-50',
        name.toLowerCase() !== 'name' && '-ml-2'
      )}
      onClick={handleColumnClick}
    >
      <span className={'capitalize whitespace-nowrap pl-2 mr-5 text-sm'}>
        {name}
      </span>
      <div
        className={classNames(
          'flex flex-col items-center opacity-0',
          'group-hover:opacity-100 group-active:opacity-100',
          'transition duration-150'
        )}
      >
        <TriangleUpIcon
          className={classNames(
            'w-5 h-5 stroke-none text-gray-400 -mb-1.5',
            'transition duration-150',
            selected && sortAscending && 'text-gray-500'
          )}
        />
        <TriangleDownIcon
          className={classNames(
            'w-5 h-5 stroke-none text-gray-400 -mt-1.5',
            'transition duration-150',
            selected && !sortAscending && 'text-gray-500'
          )}
        />
      </div>
    </div>
  );
};

export default function TableHeader({
  sortByColumn = null,
  sortAscending,
  handleColumnClick,
  allDocumentsSelected,
  selectAllDocuments,
  smallScreenSelectedColumn,
}: {
  sortByColumn: number | null;
  sortAscending: boolean;
  handleColumnClick: (column: number) => void;
  allDocumentsSelected: boolean;
  selectAllDocuments: (selectAll: boolean) => void;
  smallScreenSelectedColumn: SelectItem & {columnId:Columns}
}) {

  return (
    <tr>
      <th
        scope="col"
        className="py-3.5 px-4 font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400 w-1/4"
      >
        <div className="flex items-center gap-x-3">
          <input
            type="checkbox"
            className={classNames(
              ' text-teal-400 border-gray-300 rounded cursor-pointer',
              'focus:outline-teal-400 active:outline-teal-400 sm:mr-2'
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
        className="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400 hidden sm:table-cell"
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
        className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400 hidden sm:table-cell"
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
        className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400 hidden sm:table-cell"
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
        className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400 hidden sm:table-cell"
      >
        <ColumnName
          name={'Status'}
          selected={sortByColumn === Columns.status}
          sortAscending={sortAscending}
          handleColumnClick={() => handleColumnClick(Columns.status)}
        />
      </th>

      {/* small screen only */}
      <th
        scope="col"
        className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400 flex sm:hidden"
      >
        <ColumnName
          name={smallScreenSelectedColumn.value}
          selected={true}
          sortAscending={sortAscending}
          handleColumnClick={() => handleColumnClick(smallScreenSelectedColumn.columnId)}
        />
      </th>
    </tr>
  );
}
