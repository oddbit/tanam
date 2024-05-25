import React from "react";

interface FormGroupProps {
  label: string;
  children: React.ReactNode;
}

export function FormGroup({label, children}: FormGroupProps) {
  return (
    <div className="mb-4.5">
      <label className="mb-3 block text-sm font-medium text-black dark:text-white">{label}</label>
      {children}
    </div>
  );
}
