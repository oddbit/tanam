import React from "react";

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;
  options: Option[];
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
}

/**
 * Select component for dropdowns.
 * @param {SelectProps} props - The properties for the select component.
 * @return {JSX.Element} The rendered select component.
 */
export function Select({label, options, value, onChange, disabled = false}: SelectProps) {
  return (
    <div className={`mb-4.5 ${disabled && "cursor-not-allowed opacity-50"}`}>
      <label className="mb-3 block text-sm font-medium text-black dark:text-white">{label}</label>
      <select
        value={value}
        onChange={onChange}
        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
        disabled={disabled}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
