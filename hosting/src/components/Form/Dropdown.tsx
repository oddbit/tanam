"use client";
import React, {useState, useEffect, useRef} from "react";
import Image from "next/image";

interface Option {
  value: string;
  text: string;
  selected?: boolean;
}

interface DropdownProps {
  id: string;
  options: Option[];
  disabled?: boolean;
  multiselect?: boolean;
  iconSrc?: string;
  placeholder?: string;
}

/**
 * Dropdown component with optional multiselect and icon.
 * @param {DropdownProps} props - The properties for the dropdown component.
 * @return {JSX.Element} The rendered dropdown component.
 */
export function Dropdown({
  id,
  options: initialOptions,
  disabled = false,
  multiselect = false,
  iconSrc,
  placeholder = "Select an option",
}: DropdownProps) {
  const [options, setOptions] = useState<Option[]>(initialOptions);
  const [selected, setSelected] = useState<number[]>([]);
  const [show, setShow] = useState(false);
  const dropdownRef = useRef<any>(null);
  const trigger = useRef<any>(null);

  useEffect(() => {
    // Initialize selected options
    const initialSelected = initialOptions
      .map((option, index) => (option.selected ? index : -1))
      .filter((index) => index !== -1);
    setSelected(initialSelected);
  }, [initialOptions]);

  const open = () => {
    setShow(true);
  };

  const isOpen = () => {
    return show === true;
  };

  const select = (index: number) => {
    const newOptions = [...options];

    if (!multiselect) {
      // Single select logic
      setSelected([index]);
      newOptions.forEach((option, idx) => (option.selected = idx === index));
    } else {
      // Multiselect logic
      if (!newOptions[index].selected) {
        newOptions[index].selected = true;
        setSelected([...selected, index]);
      } else {
        const selectedIndex = selected.indexOf(index);
        if (selectedIndex !== -1) {
          newOptions[index].selected = false;
          setSelected(selected.filter((i) => i !== index));
        }
      }
    }

    setOptions(newOptions);
    setShow(false);
  };

  const remove = (index: number) => {
    const newOptions = [...options];
    const selectedIndex = selected.indexOf(index);

    if (selectedIndex !== -1) {
      newOptions[index].selected = false;
      setSelected(selected.filter((i) => i !== index));
      setOptions(newOptions);
    }
  };

  const selectedValues = () => {
    return selected.map((option) => options[option].value);
  };

  useEffect(() => {
    const clickHandler = ({target}: MouseEvent) => {
      if (!dropdownRef.current) return;
      if (!show || dropdownRef.current.contains(target) || trigger.current.contains(target)) {
        return;
      }
      setShow(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  return (
    <div className={`relative ${disabled ? "cursor-not-allowed opacity-50" : ""}`}>
      <select className="hidden" id={id} disabled={disabled}>
        {options.map((option, index) => (
          <option key={index} value={option.value} selected={option.selected}>
            {option.text}
          </option>
        ))}
      </select>

      <div className="flex flex-col items-center">
        <input name="values" type="hidden" defaultValue={selectedValues()} />
        <div className="relative inline-block w-full">
          <div className="relative flex flex-col items-center">
            <div ref={trigger} onClick={open} className="w-full">
              <div className="mb-2 flex rounded border border-stroke py-2 pl-3 pr-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input">
                {iconSrc && (
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <Image src={iconSrc} alt="Icon" width={20} height={20} />
                  </div>
                )}
                <div className="flex flex-auto flex-wrap gap-3 ml-8">
                  {selected.map((index) => (
                    <div
                      key={index}
                      className="my-1.5 flex items-center justify-center rounded border-[.5px] border-stroke bg-gray px-2.5 py-1.5 text-sm font-medium dark:border-strokedark dark:bg-white/30"
                    >
                      <div className="max-w-full flex-initial">{options[index].text}</div>
                      <div className="flex flex-auto flex-row-reverse">
                        <div
                          onClick={() => !disabled && remove(index)}
                          className="cursor-pointer pl-2 hover:text-danger"
                        >
                          <svg
                            className="fill-current"
                            role="button"
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M9.35355 3.35355C9.54882 3.15829 9.54882 2.84171 9.35355 2.64645C9.15829 2.45118 8.84171 2.45118 8.64645 2.64645L6 5.29289L3.35355 2.64645C3.15829 2.45118 2.84171 2.45118 2.64645 2.64645C2.45118 2.84171 2.45118 3.15829 2.64645 3.35355L5.29289 6L2.64645 8.64645C2.45118 8.84171 2.45118 9.15829 2.64645 9.35355C2.84171 9.54882 3.15829 9.54882 3.35355 9.35355L6 6.70711L8.64645 9.35355C8.84171 9.54882 9.15829 9.54882 9.35355 9.35355C9.54882 9.15829 9.54882 8.84171 9.35355 8.64645L6.70711 6L9.35355 3.35355Z"
                              fill="currentColor"
                            ></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                  ))}
                  {selected.length === 0 && (
                    <div className="flex-1">
                      <input
                        placeholder={placeholder}
                        className="h-full w-full appearance-none bg-transparent p-1 px-2 outline-none"
                        disabled={disabled}
                      />
                    </div>
                  )}
                </div>
                <div className="flex w-8 items-center py-1 pl-1 pr-1">
                  <button
                    type="button"
                    onClick={open}
                    className="h-6 w-6 cursor-pointer outline-none focus:outline-none"
                    disabled={disabled}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g opacity="0.8">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                          fill="#637381"
                        ></path>
                      </g>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div className="w-full px-4">
              <div
                className={`max-h-select absolute left-0 top-full z-50 w-full overflow-y-auto rounded bg-white shadow dark:bg-form-input ${
                  isOpen() ? "" : "hidden"
                }`}
                ref={dropdownRef}
                onFocus={() => setShow(true)}
                onBlur={() => setShow(false)}
              >
                <div className="flex w-full flex-col">
                  {options.map((option, index) => (
                    <div key={index}>
                      <div
                        className="w-full cursor-pointer rounded-t border-b border-stroke hover:bg-primary/5 dark:border-form-strokedark"
                        onClick={() => !disabled && select(index)}
                      >
                        <div
                          className={`relative flex w-full items-center border-l-2 border-transparent p-2 pl-2 ${
                            option.selected ? "border-primary" : ""
                          }`}
                        >
                          <div className="flex w-full items-center">
                            <div className="mx-2 leading-6">{option.text}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
