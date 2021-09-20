import { useState } from "react";
import { StarIcon } from "@heroicons/react/outline";
import { useTable, useGlobalFilter, useAsyncDebounce } from "react-table";

export const ColorTdCell = ({ value, column, row }) => {
  const textColor = value < 0 ? "text-red-500" : "text-green-500";
  return (
    <td
      className={`pl-8 py-4 whitespace-nowrap text-md text-left ${textColor}`}
    >
      {value}
    </td>
  );
};

export const WatchlistIconCell = ({ isWatching, onItemClick }) => {
  const fillColor = isWatching ? "yellow" : "none";
  return (
    <div className="flex justify-items-end items-center">
      <StarIcon
        fill={`${fillColor}`}
        className="h-6 w-6 cursor-pointer "
        onClick={() => onItemClick()}
      />
    </div>
  );
};

export const AvatarCell = ({ value, column, row }) => {
  return (
    <div className="flex items-center">
      <div className="flex-shrink-0 h-10 w-10">
        <img
          className="h-10 w-10 rounded-full"
          src={`https://assets.coincap.io/assets/icons/${
            row.original[column.symbolAccessor]
          }@2x.png`}
          alt=""
        />
      </div>
      <div className="ml-6">
        <div className="text-sm font-medium text-gray-900">{value}</div>
      </div>
    </div>
  );
};

// Define a default UI for filtering
const GlobalFilter = ({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) => {
  const [value, setValue] = useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 250);

  return (
    <span>
      <input
        className="appearance-none border shadow rounded w-30 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder="Search..."
      />
    </span>
  );
};

export const Table = ({ columns, data }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter
  );

  // Render the UI for your table
  return (
    <>
      <GlobalFilter
        preGlobalFilteredRows={preGlobalFilteredRows}
        globalFilter={state.globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
      <div className="my-2 h-max-full overflow-auto rounded-lg shadow-xl scrollbar-thin scrollbar-thumb-rounded-lg scrollbar-thumb-gray-600 scrollbar-track-gray-100">
        <div className="shadow border-gray-200">
          <table
            className="min-w-full table-fixed divide-y divide-gray-200"
            {...getTableProps}
          >
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th
                      className="sticky top-0 w-1/8 px-6 py-3 text-left text-sm font-medium text-gray-500 bg-gray-100 uppercase"
                      {...column.getHeaderProps()}
                    >
                      {column.render("Header")}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody
              className="bg-white divide-y divide-gray-200"
              {...getTableBodyProps()}
            >
              {rows.map((row, i) => {
                prepareRow(row);
                return (
                  <tr
                    className="hover:bg-gray-100 transition duration-150"
                    {...row.getRowProps()}
                  >
                    {row.cells.map((cell) => {
                      return (
                        <td
                          className="pl-6 py-4 whitespace-nowrap text-md text-left text-gray-500"
                          {...cell.getCellProps()}
                        >
                          {cell.render("Cell")}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
