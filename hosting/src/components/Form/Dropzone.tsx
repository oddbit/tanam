import React from "react";

interface DropzoneProps {
  disabled?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Dropzone component for handle file.
 * @param {DropzoneProps} props - The properties for the dropzone component.
 * @return {JSX.Element} The rendered dropzone component.
 */
export function Dropzone({disabled, value, onChange}: DropzoneProps) {
  return (
    <div
      id="FileUpload"
      className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border border-dashed border-primary bg-gray px-4 py-4 dark:bg-meta-4 sm:py-7.5"
    >
      <input
        type="file"
        accept="image/*"
        disabled={disabled}
        value={value}
        onChange={onChange}
        className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
      />
      <div className="flex flex-col items-center justify-center space-y-3">
        <span className="i-ic-outline-file-upload text-primary h-[28px] w-[28px]" />
        <p>
          <span className="text-primary">Click to upload</span> or drag and drop
        </p>
        <p className="mt-1.5">SVG, PNG, JPG or GIF</p>
        <p>(max, 800 X 800px)</p>
      </div>
    </div>
  );
}
