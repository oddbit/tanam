"use client";
import flatpickr from "flatpickr";
import {BaseOptions, DateLimit, DateOption} from "flatpickr/dist/types/options";
import {useEffect, useRef} from "react";

interface DatePickerProps {
  label: string;
  placeholder: string;
  enableTime?: boolean;
  dateFormat?: string;
  defaultValue?: Date;
  disabledDates?: DateLimit<DateOption>[];
  enabledDates?: DateLimit<DateOption>[];
  maxDate?: DateOption;
  maxTime?: DateOption;
  minDate?: DateOption;
  minTime?: DateOption;
  onChange?: (date: Date) => void;
  styleType?: "default" | "static" | "withArrows";
  disabled?: boolean;
}

/**
 * DatePicker component with different style options.
 * @param {DatePickerProps} props - The properties for the date picker component.
 * @return {JSX.Element} The rendered date picker component.
 */
export function DatePicker(props: DatePickerProps) {
  const {
    label,
    placeholder,
    defaultValue,
    onChange,
    styleType = "default",
    dateFormat = "M j, Y",
    disabled = false,
    enableTime = false,
    maxDate,
    maxTime,
    minDate,
    minTime,
  } = props;

  const inputRef = useRef<HTMLInputElement>(null);
  const pickerRef = useRef<flatpickr.Instance | null>(null);

  const config = {
    mode: "single",
    dateFormat,
    enableTime,
    maxDate,
    maxTime,
    minDate,
    minTime,
    defaultDate: defaultValue,
    // Prevents Flatpickr from closing when selecting a date/time
    closeOnSelect: false,
    onChange: (selectedDates: Date[]) => {
      if (onChange && selectedDates.length > 0) {
        onChange(selectedDates[0]);
      }
    },
  } as Partial<BaseOptions>;

  function getFlatPickr() {
    switch (styleType) {
      case "static":
        return flatpickr(inputRef.current!, {
          ...config,
          static: true,
          monthSelectorType: "static",
        });
      case "withArrows":
        return flatpickr(inputRef.current!, {
          ...config,
          static: true,
          monthSelectorType: "static",
          prevArrow: `<svg className="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" /></svg>`,
          nextArrow: `<svg className="fill-current" width="7" height="11"><path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" /></svg>`,
        });
      default:
        return flatpickr(inputRef.current!, config);
    }
  }

  useEffect(() => {
    pickerRef.current = getFlatPickr();

    return () => {
      if (pickerRef.current) {
        pickerRef.current.destroy();
      }
    };
  }, [onChange, styleType, defaultValue]);

  return (
    <div className={`mb-4.5 ${disabled && "cursor-not-allowed opacity-50"}`}>
      <label className="mb-3 block text-sm font-medium text-black dark:text-white">{label}</label>
      <div className="relative">
        <input
          ref={inputRef}
          className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          placeholder={placeholder}
          disabled={disabled}
        />
        <div className="pointer-events-none absolute inset-0 left-auto right-5 flex items-center">
          <span className="i-ic-round-keyboard-arrow-down w-[20px] h-[20px]" />
        </div>
      </div>
    </div>
  );
}
