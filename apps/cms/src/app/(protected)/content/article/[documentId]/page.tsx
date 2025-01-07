"use client";
import {UserNotification} from "@tanam/domain-frontend";
import {
  Badge,
  Button,
  Input,
  Loader,
  Modal,
  MultipleText,
  Notification,
  PageHeader,
  TextArea,
  TiptapEditor,
} from "@tanam/ui-components";
import {useParams, useRouter} from "next/navigation";
import {Suspense, useEffect, useState} from "react";
import {useCrudTanamDocument, useTanamDocument} from "../../../../../hooks/useTanamDocuments";

export default function DocumentDetailsPage() {
  const router = useRouter();
  const {documentId} = useParams<{documentId: string}>() ?? {};
  const {data: document, error: documentError} = useTanamDocument(documentId);
  const {update, error: writeError} = useCrudTanamDocument();

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [showModalMetadata, setShowMetadataModal] = useState<boolean>(false);
  const [readonlyMode] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<UserNotification | null>(null);

  useEffect(() => {
    if (!!document?.documentType && document?.documentType !== "article") {
      router.push(`/content/${document?.documentType}/${document?.id}`);
    }
  }, [document, router]);

  useEffect(() => {
    setNotification(documentError || writeError);
  }, [documentError, writeError]);

  useEffect(() => {
    if (document) {
      setTitle(document.data.title as string);
      setDescription(document.data.blurb as string);
      setTags((document.data.tags ?? []) as string[]);
    }

    return () => {
      pruneState();
    };
  }, [document, showModalMetadata]);

  function pruneState() {
    setTitle("");
    setDescription("");
    setTags((document?.data.tags ?? []) as string[]);
  }

  async function fetchDocumentUpdate(title: string, blurb: string, tags: string[]) {
    console.log("[fetchDocumentUpdate]", title);
    if (!document) {
      return;
    }

    document.data.title = title;
    document.data.blurb = blurb;
    document.data.tags = tags;
    await update(document);
  }

  async function onDocumentContentChange(content: string) {
    console.log("[onDocumentContentChange]", content);
    if (!document) {
      return;
    }

    document.data.content = content;
    await update(document);
  }

  function onCloseMetadataModal() {
    setShowMetadataModal(false);
  }

  async function onSaveMetadataModal() {
    setLoading(true);

    setNotification(null);

    try {
      await fetchDocumentUpdate(title, description, tags);

      setNotification(new UserNotification("success", "Update Metadata", "Success to update metadata"));
    } catch (error) {
      console.error(error);
      setNotification(new UserNotification("error", "Update Metadata", "Failed to update metadata"));
    } finally {
      setLoading(false);
      onCloseMetadataModal();
    }
  }

  function onOpenMetadata() {
    setShowMetadataModal(true);
  }

  /**
   * Modal actions for saving or canceling metadata changes.
   * @constant
   * @type {JSX.Element}
   */
  const modalActionMetadata = (
    <div className="flex flex-col sm:flex-row justify-end gap-3">
      {/* Start button to close the metadata modal */}
      <Button
        title="Close"
        loading={loading}
        disabled={readonlyMode || loading}
        onClick={onCloseMetadataModal}
        style="outline-rounded"
      />
      {/* End button to close the metadata modal */}

      {/* Start button to save changes metadata */}
      <Button
        title="Save"
        loading={loading}
        disabled={readonlyMode || loading}
        onClick={onSaveMetadataModal}
        style="rounded"
      />
      {/* End button to save changes metadata */}
    </div>
  );

  return (
    <>
      {notification && (
        <Notification type={notification.type} title={notification.title} message={notification.message} />
      )}

      <Suspense fallback={<Loader />}>
        {document ? (
          <>
            <div className="relative w-full">
              <div className="relative w-full flex flex-row mb-4">
                <Button title="Edit Metadata" loading={loading} onClick={onOpenMetadata} style="rounded">
                  <span className="i-ic-outline-edit mr-2" />
                </Button>
              </div>

              <div className="relative w-full flex flex-row mb-4">
                <PageHeader pageName={document.data.title as string} />
              </div>

              <div className="relative w-full flex flex-row mb-4">
                <p>{document.data.blurb as string}</p>
              </div>

              <div className="relative w-full flex flex-wrap gap-2">
                {tags.length > 0 && tags.map((tag, index) => <Badge key={index} title={tag} />)}
              </div>

              <hr className="mt-4" />
            </div>

            {document?.data.content && (
              <TiptapEditor
                key={"article-content"}
                value={document?.data.content as string}
                disabled={readonlyMode}
                onChange={onDocumentContentChange}
              />
            )}

            {/* Start modal metadata */}
            <Modal
              isOpen={showModalMetadata}
              disableOverlayClose={true}
              onClose={onCloseMetadataModal}
              actions={modalActionMetadata}
              title="Metadata"
            >
              <div className="relative w-full">
                <div className="relative w-full flex flex-row mb-4">
                  <Input
                    key="titleArticle"
                    type="text"
                    placeholder="Title"
                    disabled={readonlyMode || loading}
                    value={title || ""}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="relative w-full flex flex-row mb-4">
                  <TextArea
                    key="descriptionArticle"
                    placeholder="Description"
                    rows={3}
                    disabled={readonlyMode || loading}
                    value={description || ""}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="relative w-full">
                  <MultipleText
                    placeholder="Add tags"
                    disabled={readonlyMode || loading}
                    value={tags}
                    onChange={(value) => setTags(value)}
                  />
                </div>
              </div>
            </Modal>
            {/* End modal metadata */}
          </>
        ) : (
          <Loader />
        )}
      </Suspense>
    </>
  );
}
