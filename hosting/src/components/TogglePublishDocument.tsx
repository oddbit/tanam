import {Button} from "@/components/Button";
import {useCrudTanamDocument, useTanamDocument} from "@/hooks/useTanamDocuments";
import {serverTimestamp} from "firebase/firestore";
import {useParams} from "next/navigation";

export function TogglePublishDocument() {
  const {documentId} = useParams<{documentId: string}>() ?? {};
  const {data: document} = useTanamDocument(documentId);
  const {update} = useCrudTanamDocument();

  async function onTogglePublishDocument() {
    let data = document?.toJson();

    if (document?.status === "unpublished") {
      data = {...data, status: "published", publishedAt: serverTimestamp()};
    }

    if (document?.status === "published") {
      data = {...data, status: "unpublished", publishedAt: null};
    }

    await update(documentId, {...data});
  }

  return (
    documentId && (
      <>
        <Button
          title={document?.status === "published" ? "Unpublish" : "Publish"}
          onClick={onTogglePublishDocument}
          style="outline"
          color="primary"
        />
      </>
    )
  );
}
