import React from "react";

type StatusType = "success" | "danger" | "warning" | "info";

interface TableRowLabelProps {
  title: string;
  status: StatusType;
}

export function TableRowLabel({title, status}: TableRowLabelProps) {
  let colorClasses = "";

  switch (status) {
    case "success":
      colorClasses = "bg-success text-success";
      break;
    case "danger":
      colorClasses = "bg-danger text-danger";
      break;
    case "warning":
      colorClasses = "bg-warning text-warning";
      break;
    case "info":
      colorClasses = "bg-gray-300 text-gray-700";
      break;
  }

  return (
    <p className={`inline-flex rounded-full bg-opacity-10 px-3 py-1 text-sm font-medium ${colorClasses}`}>{title}</p>
  );
}
