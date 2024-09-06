import React from "react";

interface FormGroupProps {
  label: string;
  children: React.ReactNode;
  disabled?: boolean;
}

/**
 * FormGroup component to group form elements.
 * @param {FormGroupProps} props - The properties for the form group component.
 * @return {JSX.Element} The rendered form group component.
 */
export function FormGroup({label, children, disabled = false}: FormGroupProps) {
  return (
    <div className={`mb-4.5 ${disabled && "cursor-not-allowed opacity-50"}`}>
      <label className="mb-3 block text-sm font-medium text-black dark:text-white">{label}</label>
      {children}
    </div>
  );
}
