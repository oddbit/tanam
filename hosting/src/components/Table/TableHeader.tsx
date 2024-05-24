import React from "react";

interface TableHeaderProps {
  headers: React.ReactNode[];
}

export function TableHeader({headers}: TableHeaderProps) {
  return (
    <thead>
      <tr className="bg-gray-2 text-left dark:bg-meta-4">
        {headers.map((header, index) => (
          <TableHeaderCell key={index}>{header}</TableHeaderCell>
        ))}
      </tr>
    </thead>
  );
}

interface TableHeaderCellProps {
  children: React.ReactNode;
}

function TableHeaderCell({children}: TableHeaderCellProps) {
  return <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">{children}</th>;
}
