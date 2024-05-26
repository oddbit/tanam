"use client";
import {useState} from "react";

type CheckboxStyle = "square" | "check" | "cross" | "filledRound" | "borderedRound";

interface CheckboxProps {
  label: string;
  styleType?: CheckboxStyle;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

export function Checkbox({label, styleType = "check", checked = false, onChange}: CheckboxProps) {
  const [isChecked, setIsChecked] = useState<boolean>(checked);

  const handleChange = () => {
    const newChecked = !isChecked;
    setIsChecked(newChecked);
    if (onChange) {
      onChange(newChecked);
    }
  };

  const getStyleClasses = () => {
    switch (styleType) {
      case "square":
        return `mr-4 flex h-5 w-5 items-center justify-center rounded border ${isChecked && "border-primary bg-gray dark:bg-transparent"}`;
      case "check":
        return `box mr-4 flex h-5 w-5 items-center justify-center rounded border ${isChecked && "border-primary bg-gray dark:bg-transparent"}`;
      case "cross":
        return `box mr-4 flex h-5 w-5 items-center justify-center rounded border ${isChecked && "border-primary bg-gray dark:bg-transparent"}`;
      case "filledRound":
        return `box mr-4 flex h-5 w-5 items-center justify-center rounded-full border border-primary ${isChecked && "!border-4"}`;
      case "borderedRound":
        return `mr-4 flex h-5 w-5 items-center justify-center rounded-full border ${isChecked && "border-primary"}`;
      default:
        return "";
    }
  };

  const getSpanClasses = () => {
    switch (styleType) {
      case "square":
        return `h-2.5 w-2.5 rounded-sm ${isChecked && "bg-primary"}`;
      case "check":
        return `opacity-0 ${isChecked && "!opacity-100"}`;
      case "cross":
        return `text-primary opacity-0 ${isChecked && "!opacity-100"}`;
      case "filledRound":
        return "h-2.5 w-2.5 rounded-full bg-white dark:bg-transparent";
      case "borderedRound":
        return `h-2.5 w-2.5 rounded-full bg-transparent ${isChecked && "!bg-primary"}`;
      default:
        return "";
    }
  };

  return (
    <div>
      <label htmlFor="checkboxLabel" className="flex cursor-pointer select-none items-center">
        <div className="relative">
          <input type="checkbox" id="checkboxLabel" className="sr-only" onChange={handleChange} />
          <div className={getStyleClasses()}>
            <span className={getSpanClasses()}>
              {styleType === "check" && isChecked && (
                <svg width="11" height="8" viewBox="0 0 11 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z"
                    fill="#3056D3"
                    stroke="#3056D3"
                    strokeWidth="0.4"
                  ></path>
                </svg>
              )}
              {styleType === "cross" && isChecked && (
                <svg
                  className="h-3.5 w-3.5 stroke-current"
                  fill="none"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              )}
            </span>
          </div>
        </div>
        {label}
      </label>
    </div>
  );
}
