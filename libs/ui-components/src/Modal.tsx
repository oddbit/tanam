import React from "react";
import {Button} from "./Button";

interface ModalProps {
  isOpen: boolean;
  disableOverlayClose?: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  headerRight?: React.ReactNode;
  headerLeft?: React.ReactNode;
}

/**
 * Reusable Modal component for displaying content in a modal dialog.
 * @param {ModalProps} props - The properties for the Modal component.
 * @return {JSX.Element | null} The rendered Modal component or null if not open.
 */
export function Modal({
  isOpen,
  disableOverlayClose,
  title,
  children,
  actions,
  headerRight,
  headerLeft,
  onClose,
}: ModalProps): JSX.Element | null {
  // If the modal is not open, don't render anything
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-full z-9999 overflow-y-auto">
      {/* Start background overlay */}
      <div
        className="fixed w-full h-screen bg-black opacity-50"
        onClick={() => {
          if (disableOverlayClose) return;

          onClose();
        }}
      ></div>
      {/* End background overlay */}

      <div className="flex items-center justify-center min-h-screen px-4 text-center">
        {/* Start modal content */}
        <div className="inline-block bg-white dark:bg-black rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
          {/* Start modal header */}
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            {headerLeft ? headerLeft : <h3 className="text-xl font-semibold text-black dark:text-white">{title}</h3>}

            {headerRight ? (
              headerRight
            ) : (
              <Button onClick={onClose} style="plain-text" className={["text-black dark:text-white !p-0"]}>
                <span className="i-ic-baseline-close w-[22px] h-[22px]" />
                <span className="sr-only">Close modal</span>
              </Button>
            )}
          </div>
          {/* End modal header */}

          {/* Start modal body */}
          <div className="p-4 md:p-5 space-y-4 text-black dark:text-white">{children}</div>
          {/* End modal body */}

          {/* Modal footer */}
          <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600 sm:flex-row-reverse">
            {actions ? (
              actions
            ) : (
              <Button onClick={onClose} style="outline-rounded" className={["text-black dark:text-white"]}>
                Close
              </Button>
            )}
          </div>
        </div>
        {/* End modal content */}
      </div>
    </div>
  );
}
