import React from 'react';

// Props interface for the Modal component
interface ModalProps {
  isOpen: boolean;
  disableOverlayClose?: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

/**
 * Reusable Modal component for displaying content in a modal dialog.
 * @param {ModalProps} props - The properties for the Modal component.
 * @return {JSX.Element | null} The rendered Modal component or null if not open.
 */
export function Modal({ isOpen, disableOverlayClose, title, children, actions, onClose }: ModalProps): JSX.Element | null {
  // If the modal is not open, don't render anything
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-999 overflow-y-auto">
      {/* Background overlay */}
      <div
        className="fixed w-full h-screen bg-black opacity-50"
        onClick={
          () => {
            if (disableOverlayClose) return

            onClose()
          }
        }
      ></div>

      <div className="flex items-center justify-center min-h-screen px-4 text-center">
        {/* Centering trick for modal */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        {/* Modal content */}
        <div className="inline-block bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
          {/* Modal header and body */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left">
                {/* Modal title */}
                <h3 className="text-lg leading-6 font-medium" id="modal-title">
                  {title}
                </h3>
                {/* Modal children content */}
                <div className="mt-2">
                  {children}
                </div>
              </div>
            </div>
          </div>
          {/* Modal footer with custom or default actions */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            {actions ? (
              actions
            ) : (
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={onClose}
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
