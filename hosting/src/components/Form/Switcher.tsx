"use client";
import { clsx } from "clsx";
import { useEffect, useState } from "react";

interface SwitcherProps {
  style?: "default" | "rounded";
  initialValue?: boolean;
  disabled?: boolean;
  onIcon?: string;
  offIcon?: string;
  onChange?: (checked: boolean) => void;
}

export function Switcher({
  style = "default",
  initialValue = false,
  disabled = false,
  onIcon,
  offIcon,
  onChange,
}: SwitcherProps) {
  const [enabled, setEnabled] = useState<boolean>(false);

  useEffect(() => {
    setEnabled(initialValue)
  }, []);

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
              className={
                clsx("h-5 w-14 rounded-full transition", enabled ? "bg-primary dark:bg-primary" : "bg-meta-9 dark:bg-[#5A616B]")
              }
            ></div>
            <div
              className={
                clsx("dot shadow-md absolute -top-1 left-0 flex h-7 w-7 items-center justify-center rounded-full bg-white dark:bg-[#b0b0b0] transition-transform", enabled ? "translate-x-full" : "")
              }
            >
              {onIcon && offIcon && (
                <span
                  className={clsx("w-[16px] h-[16px] text-black dark:text-[#5A616B]", enabled ? onIcon : offIcon)}
                />
              )}
            </div>
          </>
        );
      case "default":
      default:
        return (
          <>
            <div
              className={
                clsx("block h-8 w-14 rounded-full transition", enabled ? "bg-primary dark:bg-primary" : "bg-meta-9 dark:bg-[#5A616B]")
              }
            ></div>
            <div
              className={
                clsx("absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white dark:bg-[#b0b0b0] transition-transform", enabled ? "translate-x-full" : "")
              }
            >
              {onIcon && offIcon && (
                <span
                  className={clsx("w-[16px] h-[16px] text-black dark:text-[#5A616B]", enabled ? onIcon : offIcon)}
                />
              )}
            </div>
          </>
        );
    }
  };

  return (
    <div className={
      clsx("flex items-center", disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer")
    }>
      <label className="flex items-center select-none">
        <div className="relative">
          <input type="checkbox" className="sr-only" onChange={handleToggle} checked={enabled} disabled={disabled} />
          {getSwitcherStyle()}
        </div>
      </label>
    </div>
  );
}
