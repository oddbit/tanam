import React from "react";

interface TableProps {
  headers: string[];
  rows: React.ReactNode[][];
  totalRecords?: number;
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
 *  />
 * ```
 *
 * @param {TableProps} param0 Table parameters
 * @return {JSX.Element} Table component
 */
export function Table({headers, rows, totalRecords}: TableProps): JSX.Element {
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
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-[#eee] dark:border-strokedark">
                {row.map((col, colIndex) => (
                  <td key={`r${rowIndex}c${colIndex}`} className="px-4 py-5 dark:border-strokedark">
                    {col}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="relative p-4">Total Records: {totalRecords ?? rows.length}</div>
      </div>
    </div>
  );
}
