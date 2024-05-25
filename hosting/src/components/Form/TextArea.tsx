import React from "react";

interface TextareaProps {
  label: string;
  placeholder: string;
  disabled?: boolean;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function Textarea({label, placeholder, disabled = false, value, onChange}: TextareaProps) {
  return (
    <div>
      <label className="mb-3 block text-sm font-medium text-black dark:text-white">{label}</label>
      <textarea
        rows={6}
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        onChange={onChange}
        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary dark:disabled:bg-black"
      ></textarea>
    </div>
  );
}
