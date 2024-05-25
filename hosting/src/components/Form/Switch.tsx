import React from "react";

interface SwitchProps {
  label: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function Switch({label, checked, onChange}: SwitchProps) {
  return (
    <div className="flex items-center">
      <label className="mb-3 block text-sm font-medium text-black dark:text-white">{label}</label>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="ml-3 h-6 w-6 rounded border-stroke dark:border-strokedark"
      />
    </div>
  );
}
