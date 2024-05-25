import React from "react";

interface TextareaProps {
  placeholder: string;
  rows: number;
  disabled?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function TextArea({placeholder, rows, disabled = false, value, onChange}: TextareaProps) {
  return (
    <textarea
      placeholder={placeholder}
      rows={rows}
      disabled={disabled}
      value={value}
      onChange={onChange}
      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary dark:disabled:bg-black"
    ></textarea>
  );
}
