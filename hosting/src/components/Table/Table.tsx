import React from "react";

interface TableProps {
  children: React.ReactNode;
}

export function Table({children}: TableProps) {
  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">{children}</table>
      </div>
    </div>
  );
}
