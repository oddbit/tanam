import { AcceptFileType, getAcceptDescription } from "@/utils/fileUpload";
import React from "react";

// Props interface for the Dropzone component
interface DropzoneProps {
  value?: string;
  disabled?: boolean;
  accept?: AcceptFileType;
  onChange?: (fileString: string | null, fileBlob: File | null) => void; // Callback to send the file data to parent
}

/**
 * Function to handle file reading and sending data to parent.
 * @param {File} file - The file object to handle.
 * @param {(fileString: string | null, fileBlob: File | null) => void} callback - Callback function to handle the file data.
 */
export function handleFile(file: File, callback?: (fileString: string | null, fileBlob: File | null) => void) {
  const reader = new FileReader();
  
  reader.onloadend = () => {
    if (callback) {
      console.info('reader result :: ', reader)
      callback(reader.result as string, file);
    }
  };
  
  reader.readAsDataURL(file);
}

/**
 * Function to handle file input change event.
 * @param {React.ChangeEvent<HTMLInputElement>} e - The change event from file input.
 * @param {(fileString: string | null, fileBlob: File | null) => void} callback - Callback function to handle the file data.
 */
export function handleChange(
  e: React.ChangeEvent<HTMLInputElement>,
  callback?: (fileString: string | null, fileBlob: File | null) => void
) {
  console.info('files :: ', e.target.files)
  if (e.target.files && e.target.files[0]) {
    handleFile(e.target.files[0], callback);
  }
}

/**
 * Dropzone component for handling file uploads and sending data to parent without preview.
 * @param {DropzoneProps} props - The properties for the dropzone component.
 * @return {JSX.Element} The rendered dropzone component.
 */
export function Dropzone({ disabled, accept = AcceptFileType.AllFiles, onChange }: DropzoneProps) {
  const [dragActive, setDragActive] = React.useState(false);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (disabled) return;
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    }
    
    if (e.type === "dragleave") {
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
          accept={accept}
          disabled={disabled}
          onChange={(e) => handleChange(e, onChange)}
          className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
        />
        <div className="flex flex-col items-center justify-center space-y-3">
          <span className="i-ic-outline-file-upload text-primary h-[28px] w-[28px]" />
          <p>
            <span className="text-primary">Click to upload</span> or drag and drop
          </p>
          <p className="mt-1.5">Allowed types: {getAcceptDescription(accept)}</p>
        </div>
      </div>
    </div>
  );
}
