import React, {FC} from "react";

interface TableProps {
  headers: string[];
  rows: React.ReactNode[][];
  isLoading?: boolean;
}

/**
 * A Table component
 *
 * Example:
 * ```tsx
 *  <Table
 *    headers={["Id", "Created", "Status", "Actions"]}
 *    rows={documents.map((document, key) => [
 *      <div>{document.id}</div>,
 *      <p>{document.createdAt.toDate().toUTCString()}</p>,
 *      <TableRowLabel title={document.status} status={document.status === "published" ? "success" : "info"} />,
 *      <TableRowActions
 *        onView={() => console.log("View", document)}
 *        onDelete={() => console.log("Delete", document)}
 *        onDownload={() => console.log("Download", document)}
 *      />,
 *    ])}
 *    isLoading={true}
 *  />
 * ```
 *
 * @param {TableProps} param0 Table parameters
 * @return {JSX.Element} Table component
 */
export function Table({headers, rows, isLoading = false}: TableProps): JSX.Element {
  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              {headers.map((header, index) => (
                <th key={index} className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({length: 20}).map((_, rowIndex) => <TableRowShimmer key={rowIndex} headers={headers} />)
              : rows.map((row, rowIndex) => <TableRow key={rowIndex} row={row} />)}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const TableRowShimmer: FC<{
  headers: string[];
  rowIndex?: number;
}> = ({headers, rowIndex}) => (
  <tr className="border-b border-[#eee] dark:border-strokedark">
    {headers.map((_, colIndex) => (
      <td key={`r${rowIndex}c${colIndex}`} className="px-4 py-5 dark:border-strokedark">
        <div className="h-5 bg-zinc-200 rounded-md animate-pulse dark:bg-gray-700"></div>
      </td>
    ))}
  </tr>
);

const TableRow: FC<{
  row: React.ReactNode[];
  rowIndex?: number;
}> = ({row, rowIndex}) => (
  <tr className="border-b border-[#eee] dark:border-strokedark">
    {row.map((col, colIndex) => (
      <td key={`r${rowIndex}c${colIndex}`} className="px-4 py-5 dark:border-strokedark">
        {col}
      </td>
    ))}
  </tr>
);
