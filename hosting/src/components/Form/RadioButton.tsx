"use client";
import {useState} from "react";

interface RadioButtonProps {
  label: string;
  style?: "filled" | "outline";
  defaultChecked?: boolean;
}

export function RadioButton({label, style = "filled", defaultChecked = false}: RadioButtonProps) {
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
    <div>
      <label className="flex cursor-pointer select-none items-center">
        <div className="relative">
          <input
            type="radio"
            className="sr-only"
            onChange={() => {
              setIsChecked(!isChecked);
            }}
            defaultChecked={defaultChecked}
          />
          {getRadioButtonStyle()}
        </div>
        {label}
      </label>
    </div>
  );
}
