import React from "react";

interface FileUploadProps {
  label: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function FileUpload({label, onChange}: FileUploadProps) {
  return (
    <div>
      <label className="mb-3 block text-sm font-medium text-black dark:text-white">{label}</label>
      <input
        type="file"
        onChange={onChange}
        className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:px-5 file:py-3 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
      />
    </div>
  );
}
