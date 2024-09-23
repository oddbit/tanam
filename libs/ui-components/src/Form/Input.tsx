import React from "react";

interface InputProps {
  type: string;
  placeholder: string;
  disabled?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Input component for text input fields.
 * @param {InputProps} props - The properties for the input component.
 * @return {JSX.Element} The rendered input component.
 */
export function Input({type, placeholder, disabled = false, value, onChange}: InputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      disabled={disabled}
      value={value}
      onChange={onChange}
      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary dark:disabled:bg-black"
    />
  );
}
