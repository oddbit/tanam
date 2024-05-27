import {useState} from "react";
import Image from "next/image";

const CheckboxThree = () => {
  const [isChecked, setIsChecked] = useState<boolean>(false);

  return (
    <div>
      <label htmlFor="checkboxLabelThree" className="flex cursor-pointer select-none items-center">
        <div className="relative">
          <input
            type="checkbox"
            id="checkboxLabelThree"
            className="sr-only"
            onChange={() => {
              setIsChecked(!isChecked);
            }}
          />
          <div
            className={`box mr-4 flex h-5 w-5 items-center justify-center rounded border ${
              isChecked && "border-primary bg-gray dark:bg-transparent"
            }`}
          >
            <span className={`text-primary opacity-0 ${isChecked && "!opacity-100"}`}>
              <Image width={10} height={6} alt="Icon Close" src={"/icons/sidebar/icon-checked-x.svg"} />
            </span>
          </div>
        </div>
        Checkbox Text
      </label>
    </div>
  );
};

export default CheckboxThree;
