import React from "react";

interface TableBodyProps {
  children: React.ReactNode;
}

export function TableBody({children}: TableBodyProps) {
  return <tbody>{children}</tbody>;
}
