import {ReactNode, useEffect, useState} from "react";

interface DialogProps {
  isOpen: boolean;
  isLoading?: boolean;
  title: string;
  children: ReactNode;
  onClose?: () => void;
  onSubmit?: () => void;
  onLoadingChange?: (isLoading: boolean) => void;
}

export default function Dialog(props: DialogProps) {
  const {isOpen, title, children, isLoading, onClose, onSubmit, onLoadingChange} = props;
  const [loading, setLoading] = useState(false);

  /**
   * Effect to trigger onLoadingChange whenever the loading prop changes.
   */
  useEffect(() => {
    if (onLoadingChange) {
      onLoadingChange(loading);
    }
  }, [loading, onLoadingChange]);

  /**
   * Effect to trigger setLoading.
   */
  useEffect(() => {
    setLoading(isLoading ?? false);

    return () => setLoading(false);
  }, [isLoading]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <div className="mb-6">{children}</div>
        <div className="flex justify-end space-x-4">
          {onClose && (
            <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400" disabled={loading}>
              Cancel
            </button>
          )}

          {onSubmit && (
            <button
              onClick={onSubmit}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}