"use client";
import "@/components/Form/styles/dropzone.scss";
import { getAcceptDescription, isFileAccepted } from "@/utils/fileUpload";
import { AcceptFileType } from "@tanam/shared";
import React, { useEffect, useRef, useState } from "react";

export interface DropzoneProps {
  value?: string;
  disabled?: boolean;
  accept?: AcceptFileType;
  onChange?: (fileString: string | null, fileBlob: File | null) => void;
}

/**
 * Dropzone component for handling file uploads and sending data to parent without preview.
 * @param {DropzoneProps} props - The properties for the dropzone component.
 * @return {JSX.Element} The rendered dropzone component.
 */
export function Dropzone({value, disabled, accept = AcceptFileType.AllFiles, onChange}: DropzoneProps): JSX.Element {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * useEffect hook that resets the file input value when the component unmounts.
   */
  useEffect(() => {
    return () => {
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    };
  }, [value]);

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
      handleFile(e.target.files[0], callback);
    }
  }

  function handleFile(file: File, callback?: (fileString: string | null, fileBlob: File | null) => void): void {
    const reader = new FileReader();

    reader.onloadend = () => {
      if (callback) {
        callback(reader.result as string, file);
      }
    };

    reader.readAsDataURL(file);
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
