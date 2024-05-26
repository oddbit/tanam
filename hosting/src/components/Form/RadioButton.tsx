"use client";
import {useState} from "react";

type RadioButtonStyle = "filled" | "bordered";

interface RadioButtonProps {
  label: string;
  styleType?: RadioButtonStyle;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

export function RadioButton({label, styleType = "filled", checked = false, onChange}: RadioButtonProps) {
  const [isChecked, setIsChecked] = useState<boolean>(checked);

  const handleChange = () => {
    const newChecked = !isChecked;
    setIsChecked(newChecked);
    if (onChange) {
      onChange(newChecked);
    }
  };

  return (
    <div>
      <label htmlFor="radioButtonLabel" className="flex cursor-pointer select-none items-center">
        <div className="relative">
          <input type="radio" id="radioButtonLabel" className="sr-only" onChange={handleChange} />
          <div
            className={`box mr-4 flex h-5 w-5 items-center justify-center rounded-full border border-primary ${
              isChecked && (styleType === "filled" ? "!border-4" : "")
            }`}
          >
            <span
              className={`h-2.5 w-2.5 rounded-full bg-white dark:bg-transparent ${isChecked && (styleType === "bordered" ? "!bg-primary" : "")}`}
            ></span>
          </div>
        </div>
        {label}
      </label>
    </div>
  );
}
