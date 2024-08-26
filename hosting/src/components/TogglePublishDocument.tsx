import {Button} from "@/components/Button";
import {useTanamDocument} from "@/hooks/useTanamDocuments";
import {TanamPublishStatus} from "@functions/definitions/TanamPublishStatus";
import {useParams} from "next/navigation";

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
          style="outline"
          color="primary"
        />
      </>
    )
  );
}
