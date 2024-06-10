"use client";
import {useState} from "react";
import {clsx} from "clsx";

interface SwitcherProps {
  style?: "default" | "rounded";
  defaultChecked?: boolean;
  disabled?: boolean;
  onIcon?: string;
  offIcon?: string;
  onChange?: (checked: boolean) => void;
}

export function Switcher({
  style = "default",
  defaultChecked = false,
  disabled = false,
  onIcon,
  offIcon,
  onChange,
}: SwitcherProps) {
  const [enabled, setEnabled] = useState<boolean>(defaultChecked);

  const handleToggle = () => {
    if (!disabled) {
      setEnabled(!enabled);
      onChange?.(!enabled);
    }
  };

  const getSwitcherStyle = () => {
    switch (style) {
      case "rounded":
        return (
          <>
            <div
              className={`h-5 w-14 rounded-full shadow-inner transition ${
                enabled ? "bg-primary dark:bg-primary" : "bg-meta-9 dark:bg-[#5A616B]"
              }`}
            ></div>
            <div
              className={`dot absolute -top-1 left-0 flex h-7 w-7 items-center justify-center rounded-full bg-white dark:bg-[#b0b0b0] transition-transform ${
                enabled ? "translate-x-full" : ""
              }`}
            >
              {onIcon && offIcon && <span className={clsx("w-[16px] h-[16px]", enabled ? onIcon : offIcon)} />}
            </div>
          </>
        );
      case "default":
      default:
        return (
          <>
            <div
              className={`block h-8 w-14 rounded-full transition ${
                enabled ? "bg-primary dark:bg-primary" : "bg-meta-9 dark:bg-[#5A616B]"
              }`}
            ></div>
            <div
              className={`absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white dark:bg-[#b0b0b0] transition-transform ${
                enabled ? "translate-x-full" : ""
              }`}
            >
              {onIcon && offIcon && <span className={clsx("w-[16px] h-[16px]", enabled ? onIcon : offIcon)} />}
            </div>
          </>
        );
    }
  };

  return (
    <div className={`flex items-center mb-2 ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}>
      <label className="flex items-center select-none">
        <div className="relative">
          <input type="checkbox" className="sr-only" onChange={handleToggle} checked={enabled} disabled={disabled} />
          {getSwitcherStyle()}
        </div>
      </label>
    </div>
  );
}
