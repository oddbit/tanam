import {Button} from "@/components/Button";
import {useTanamDocument} from "@/hooks/useTanamDocuments";
import {useParams} from "next/navigation";
import {TanamPublishStatus} from "tanam-shared/definitions/TanamPublishStatus";

export function TogglePublishDocument() {
  const {documentId} = useParams<{documentId: string}>() ?? {};
  const {data: document, changeStatus} = useTanamDocument(documentId);

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
      <>
        <Button
          title={document?.status === TanamPublishStatus.Published ? "Unpublish" : "Publish"}
          onClick={onTogglePublishDocument}
          style="outline-rounded"
          color="primary"
        />
      </>
    )
  );
}
