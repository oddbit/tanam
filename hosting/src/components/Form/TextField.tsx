import React from "react";
import {useField} from "formik";

interface TextFieldProps {
  id?: string;
  name: string;
  label?: string;
  disabled?: boolean;
  placeholder?: string;
}

/**
 * TextField component for text input fields.
 * @return {JSX.Element} The rendered input component.
 */
export function TextField({...props}: TextFieldProps) {
  const [field, meta] = useField(props);

  return (
    <>
      <input 
        {...field}
        {...props}
        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary dark:disabled:bg-black"
      />
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </>
  );
}
