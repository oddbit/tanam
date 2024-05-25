import React from "react";

interface InputProps {
  label: string;
  placeholder: string;
  type?: string;
  disabled?: boolean;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function Input({label, placeholder, type = "text", disabled = false, value, onChange}: InputProps) {
  return (
    <div>
      <label className="mb-3 block text-sm font-medium text-black dark:text-white">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        onChange={onChange}
        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary dark:disabled:bg-black"
      />
    </div>
  );
}
