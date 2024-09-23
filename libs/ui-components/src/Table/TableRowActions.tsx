import React from "react";

interface TableRowActionsProps {
  onView?: () => void;
  onDelete?: () => void;
  onDownload?: () => void;
}

export function TableRowActions({onView, onDelete, onDownload}: TableRowActionsProps) {
  return (
    <div className="flex items-center space-x-3.5">
      {onView && (
        <button onClick={onView} className="hover:text-primary">
          <span className="i-ic-outline-remove-red-eye text-primary w-[24px] h-[24px]" />
        </button>
      )}
      {onDelete && (
        <button onClick={onDelete} className="hover:text-primary">
          <span className="i-ic-baseline-delete-outline text-primary w-[24px] h-[24px]" />
        </button>
      )}
      {onDownload && (
        <button onClick={onDownload} className="hover:text-primary">
          <span className="i-ic-outline-file-download text-primary w-[24px] h-[24px]" />
        </button>
      )}
    </div>
  );
}
