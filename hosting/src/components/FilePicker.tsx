import React, {useState} from "react";

interface FilePickerProps {
  onFileSelect: (file: File) => void;
}

export default function FilePicker({onFileSelect}: FilePickerProps) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
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
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const handleClick = () => {
    document.getElementById("fileUploadInput")?.click();
  };

  return (
    <div
      className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-md ${
        dragActive ? "border-blue-400" : "border-gray-300"
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input id="fileUploadInput" type="file" className="hidden" onChange={handleChange} />
      <div className="flex flex-col items-center">
        <span className="i-ic-outline-upload w-[24px] h-[24px]" />
        <p>
          <a href="#" onClick={(e) => e.preventDefault()}>
            Click to upload
          </a>{" "}
          or drag and drop
        </p>
      </div>
    </div>
  );
}
