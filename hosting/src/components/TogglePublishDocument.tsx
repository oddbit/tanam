import {Button} from "@/components/Button";
import {DatePicker} from "@/components/Form";
import {Modal} from "@/components/Modal";
import {useTanamDocument} from "@/hooks/useTanamDocuments";
import {useParams} from "next/navigation";
import {useState} from "react";
import {TanamPublishStatus} from "tanam-shared/definitions/TanamPublishStatus";

export function TogglePublishDocument() {
  const {documentId} = useParams<{documentId: string}>() ?? {};
  const {data: document, changeStatus} = useTanamDocument(documentId);

  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDropdownPublishOpen, setIsDropdownPublishOpen] = useState(false);
  const [publishedAt, setPublishedAt] = useState<Date | undefined>();

  function pruneState() {
    setIsLoading(false);
    setIsDialogOpen(false);
    setIsDropdownPublishOpen(false);
    setPublishedAt(undefined);
  }

  async function onTogglePublishDocument() {
    if (!document) {
      return;
    }

    if (isDialogOpen && !publishedAt) {
      window.alert("Please fill published at");
      return;
    }

    setIsDropdownPublishOpen(false);

    try {
      await changeStatus(
        document.status === TanamPublishStatus.Published
          ? TanamPublishStatus.Unpublished
          : publishedAt
            ? TanamPublishStatus.Scheduled
            : TanamPublishStatus.Published,
        publishedAt ? publishedAt : undefined,
      );
    } catch (error) {
      console.error("Error :: ", error);
    } finally {
      pruneState();
    }
  }

  /**
   * Modal actions for saving or canceling schedule publish.
   * @constant
   * @type {JSX.Element}
   */
  const modalActionSchedulePublish = (
    <div className="flex flex-col sm:flex-row justify-end gap-3">
      {/* Start button to close the schedule publish modal */}
      <button
        className="flex justify-center rounded border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white sm:w-full sm:text-sm"
        onClick={pruneState}
      >
        Close
      </button>
      {/* End button to close the schedule publish modal */}

      {/* Start button to save changes schedule publish */}
      <button
        className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90 sm:w-full sm:text-sm"
        onClick={onTogglePublishDocument}
      >
        Save
      </button>
      {/* End button to save changes schedule publish */}
    </div>
  );

  return (
    documentId && (
      <>
        <div className="relative">
          <Button
            title={document?.status === TanamPublishStatus.Published ? "Unpublish" : "Publish"}
            onClick={() => {
              if (document?.status === TanamPublishStatus.Published) {
                onTogglePublishDocument();
                return;
              }

              setIsDropdownPublishOpen(!isDropdownPublishOpen);
            }}
            style="outline-rounded"
            color="primary"
          />

          <div
            className={`${isDropdownPublishOpen ? "block" : "hidden"} absolute left-0 z-10 mt-2 w-56 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="dropdownPublishDocument"
            tabIndex={-1}
          >
            <div className="py-1" role="none">
              <button
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-black hover:bg-opacity-5 w-full text-left"
                onClick={onTogglePublishDocument}
              >
                <span className="i-ic-create mr-2" />
                Publish
              </button>
              <button
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-black hover:bg-opacity-5 w-full text-left"
                onClick={() => setIsDialogOpen(true)}
              >
                <span className="i-ic-mic mr-2" />
                Scheduled Publish
              </button>
            </div>
          </div>
        </div>

        {isDialogOpen && (
          <Modal
            isOpen={isDialogOpen}
            actions={modalActionSchedulePublish}
            disableOverlayClose={true}
            onClose={pruneState}
            title={"Scheduled Publish"}
          >
            <DatePicker
              key="datePickerPublishDoc"
              disabled={isLoading}
              enableTime={true}
              label="Published At"
              placeholder="Y-m-d H:i"
              dateFormat="Y-m-d H:i"
              minDate="today"
              defaultValue={publishedAt}
              onChange={setPublishedAt}
            />
          </Modal>
        )}
      </>
    )
  );
}
