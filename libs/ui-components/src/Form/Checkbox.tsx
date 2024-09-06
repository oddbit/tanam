"use client";
import {useState} from "react";

interface CheckboxProps {
  style?: "checkmark" | "xmark" | "filled" | "circle-filled" | "circle-outline";
  label?: string;
  defaultChecked?: boolean;
  disabled?: boolean;
}

/**
 * Checkbox component with different style options.
 * @param {CheckboxProps} props - The properties for the checkbox component.
 * @return {JSX.Element} The rendered checkbox component.
 */
export function Checkbox({
  style = "checkmark",
  label = "Checkbox Text",
  defaultChecked = false,
  disabled = false,
}: CheckboxProps) {
  const [isChecked, setIsChecked] = useState<boolean>(defaultChecked);

  const getCheckboxStyle = () => {
    switch (style) {
      case "checkmark":
        return <span className={`opacity-0 i-ic-round-check ${isChecked && "!opacity-100"}`} />;
      case "xmark":
        return <span className={`text-primary opacity-0 i-ic-round-close ${isChecked && "!opacity-100"}`} />;
      case "filled":
        return <span className={`h-2.5 w-2.5 rounded-sm ${isChecked && "bg-primary"}`}></span>;
      case "circle-filled":
        return <span className={`h-2.5 w-2.5 rounded-full ${isChecked ? "bg-primary" : "bg-transparent"}`}></span>;
      case "circle-outline":
        return (
          <span
            className={`h-2.5 w-2.5 rounded-full ${isChecked ? "bg-white" : "bg-transparent"} border border-primary`}
          >
            {isChecked && <span className="h-2.5 w-2.5 rounded-full bg-primary"></span>}
          </span>
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
            type="checkbox"
            className="sr-only"
            onChange={() => !disabled && setIsChecked(!isChecked)}
            defaultChecked={defaultChecked}
            disabled={disabled}
          />
          <div
            className={`mr-4 flex h-5 w-5 items-center justify-center rounded border ${isChecked && "border-primary"}`}
          >
            {getCheckboxStyle()}
          </div>
        </div>
        {label}
      </label>
    </div>
  );
}
