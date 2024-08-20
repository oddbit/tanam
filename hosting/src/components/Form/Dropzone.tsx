import React from "react";

interface DropzoneProps {
  value?: string;
  disabled?: boolean;
  onChange?: (fileData: string | null) => void; // Callback to send the file data to parent
}

/**
 * Function to handle file reading and sending data to parent.
 * @param {File} file - The file object to handle.
 * @param {(result: string | null) => void} callback - Callback function to handle the file read result.
 */
export function handleFile(file: File, callback?: (result: string | null) => void) {
  const reader = new FileReader();
  reader.onloadend = () => {
    if (callback) {
      callback(reader.result as string);
    }
  };
  reader.readAsDataURL(file);
}

/**
 * Function to handle file input change event.
 * @param {React.ChangeEvent<HTMLInputElement>} e - The change event from file input.
 * @param {(result: string | null) => void} callback - Callback function to handle the file read result.
 */
export function handleChange(
  e: React.ChangeEvent<HTMLInputElement>,
  callback?: (result: string | null) => void
) {
  if (e.target.files && e.target.files[0]) {
    handleFile(e.target.files[0], callback);
  }
}

/**
 * Dropzone component for handling file uploads and sending data to parent without preview.
 * @param {DropzoneProps} props - The properties for the dropzone component.
 * @return {JSX.Element} The rendered dropzone component.
 */
export function Dropzone({ disabled, onChange }: DropzoneProps) {
  const [dragActive, setDragActive] = React.useState(false);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0], onChange);
    }
  };

  return (
    <div className="w-full">
      <div
        id="FileUpload"
        className={`relative mb-5.5 block w-full cursor-pointer appearance-none rounded border border-dashed border-primary bg-gray px-4 py-4 dark:bg-meta-4 sm:py-7.5 ${
          dragActive ? "bg-opacity-50" : ""
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="image/*"
          disabled={disabled}
          onChange={(e) => handleChange(e, onChange)}
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
    </div>
  );
}
