"use client";
import {useState} from "react";

interface RadioButtonProps {
  label: string;
  style?: "filled" | "outline";
  defaultChecked?: boolean;
  disabled?: boolean;
}

/**
 * RadioButton component with different style options.
 * @param {RadioButtonProps} props - The properties for the radio button component.
 * @return {JSX.Element} The rendered radio button component.
 */
export function RadioButton({label, style = "filled", defaultChecked = false, disabled = false}: RadioButtonProps) {
  const [isChecked, setIsChecked] = useState<boolean>(defaultChecked);

  const getRadioButtonStyle = () => {
    switch (style) {
      case "filled":
        return (
          <div
            className={`box mr-4 flex h-5 w-5 items-center justify-center rounded-full border border-primary ${isChecked && "!border-4"}`}
          >
            <span className="h-2.5 w-2.5 rounded-full bg-white dark:bg-transparent"></span>
          </div>
        );
      case "outline":
        return (
          <div
            className={`mr-4 flex h-5 w-5 items-center justify-center rounded-full border ${isChecked && "border-primary"}`}
          >
            <span className={`h-2.5 w-2.5 rounded-full bg-transparent ${isChecked && "!bg-primary"}`}></span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`flex items-center mb-2 ${disabled && "cursor-not-allowed opacity-50"}`}>
      <label className="flex cursor-pointer select-none items-center">
        <div className="relative">
          <input
            type="radio"
            className="sr-only"
            onChange={() => !disabled && setIsChecked(!isChecked)}
            defaultChecked={defaultChecked}
            disabled={disabled}
          />
          {getRadioButtonStyle()}
        </div>
        {label}
      </label>
    </div>
  );
}
