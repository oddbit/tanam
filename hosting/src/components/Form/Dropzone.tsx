"use client";
import "@/components/Form/styles/dropzone.scss";
import {getAcceptDescription, isFileAccepted} from "@/utils/fileUpload";
import {AcceptFileType} from "@functions/definitions/AcceptFileType";
import React, {useEffect, useRef, useState} from "react";

// Props interface for the Dropzone component
export interface DropzoneProps {
  value?: string;
  disabled?: boolean;
  accept?: AcceptFileType;
  onChange?: (fileString: string | null, fileBlob: File | null) => void; // Callback to send the file data to parent
}

/**
 * Dropzone component for handling file uploads and sending data to parent without preview.
 * @param {DropzoneProps} props - The properties for the dropzone component.
 * @return {JSX.Element} The rendered dropzone component.
 */
export function Dropzone({value, disabled, accept = AcceptFileType.AllFiles, onChange}: DropzoneProps): JSX.Element {
  const [dragActive, setDragActive] = useState(false); // State to track if a file is being dragged over the dropzone.
  const inputRef = useRef<HTMLInputElement>(null); // Reference to the hidden file input element.

  /**
   * useEffect hook that resets the file input value when the component unmounts.
   */
  useEffect(() => {
    return () => {
      if (inputRef.current) {
        // Check if the input element exists.
        inputRef.current.value = ""; // Reset the input value to an empty string.
      }
    };
  }, [value]); // This effect depends on the `value` prop.

  /**
   * Handles drag events (dragenter, dragover, dragleave) to manage the drag state.
   * @param {React.DragEvent<HTMLDivElement>} e - The drag event triggered when a file is dragged over the dropzone.
   */
  function handleDrag(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();

    if (disabled) return;

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    }

    if (e.type === "dragleave") {
      setDragActive(false);
    }
  }

  /**
   * Handles the drop event when a file is dropped into the dropzone.
   * @param {React.DragEvent<HTMLDivElement>} e - The drop event triggered when a file is dropped.
   */
  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];

      if (!isFileAccepted(file, accept)) {
        console.error(`File type not accepted: ${file.name}`);

        return;
      }

      handleFile(file, onChange);
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>,
    callback?: (fileString: string | null, fileBlob: File | null) => void,
  ): void {
    if (e.target.files && e.target.files[0]) {
      // Check if a file is selected.
      handleFile(e.target.files[0], callback); // Process the selected file using the handleFile function.
    }
  }

  function handleFile(file: File, callback?: (fileString: string | null, fileBlob: File | null) => void): void {
    const reader = new FileReader(); // Create a new FileReader instance.

    reader.onloadend = () => {
      // Event handler for when the file has been read.
      if (callback) {
        // If a callback is provided,
        callback(reader.result as string, file); // Pass the base64 string and file blob to the callback.
      }
    };

    reader.readAsDataURL(file); // Read the file as a Data URL (base64 string).
  }

  return (
    <div className="c-dropzone w-full">
      <div
        id="FileUpload"
        className={`dropzone__inner-wrapper relative mb-5.5 block w-full cursor-pointer appearance-none rounded border border-dashed border-primary bg-gray px-4 py-4 dark:bg-meta-4 sm:py-7.5 ${
          dragActive ? "drag--active" : ""
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={inputRef}
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
