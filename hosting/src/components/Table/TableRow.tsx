import React from "react";

interface TableRowProps {
  columns: React.ReactNode[];
}

export function TableRow({columns}: TableRowProps) {
  return (
    <tr className="border-b border-[#eee] dark:border-strokedark">
      {columns.map((column, index) => (
        <td key={index} className="px-4 py-5 dark:border-strokedark">
          {column}
        </td>
      ))}
    </tr>
  );
}
