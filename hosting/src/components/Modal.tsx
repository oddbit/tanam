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
      {/* Start background overlay */}
      <div
        className="fixed w-full h-screen bg-black opacity-50"
        onClick={
          () => {
            if (disableOverlayClose) return

            onClose()
          }
        }
      ></div>
      {/* End background overlay */}

      <div className="flex items-center justify-center min-h-screen px-4 text-center">
        {/* Start modal content */}
        <div className="inline-block bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
          {/* Start modal header */}
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal"
              onClick={onClose}
            >
              <span className="i-ic-baseline-close w-[22px] h-[22px]" />
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          {/* End modal header */}

          {/* Start modal body */}
          <div className="p-4 md:p-5 space-y-4">
            {children}
          </div>
          {/* End modal body */}

          {/* Modal footer */}
          <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600 sm:flex-row-reverse">
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
        {/* End modal content */}
      </div>
    </div>
  );
};
