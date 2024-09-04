import {Button} from "@/components/Button";
import {useTanamDocument} from "@/hooks/useTanamDocuments";
import {useParams} from "next/navigation";
import {useState} from "react";
import {TanamPublishStatus} from "tanam-shared/definitions/TanamPublishStatus";

export function TogglePublishDocument() {
  const {documentId} = useParams<{documentId: string}>() ?? {};
  const {data: document, changeStatus} = useTanamDocument(documentId);

  const [isDropdownPublishOpen, setIsDropdownPublishOpen] = useState(false);

  async function onTogglePublishDocument() {
    if (!document) {
      return;
    }

    // Toggle the status of the document
    return changeStatus(
      document.status === TanamPublishStatus.Unpublished
        ? TanamPublishStatus.Unpublished
        : TanamPublishStatus.Published,
    );
  }

  return (
    documentId && (
      <div className="relative">
        <Button
          title={document?.status === TanamPublishStatus.Published ? "Unpublish" : "Publish"}
          onClick={() => setIsDropdownPublishOpen(!isDropdownPublishOpen)}
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
              onClick={() => {}}
            >
              <span className="i-ic-mic mr-2" />
              Scheduled Publish
            </button>
          </div>
        </div>
      </div>
    )
  );
}
