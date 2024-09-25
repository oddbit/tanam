"use client";
import {UserNotification} from "@tanam/domain-frontend";
import {
  Badge,
  Button,
  Input,
  Loader,
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
  const [readonlyMode] = useState<boolean>(false);
  const [updateMetadata, setUpdateMetadata] = useState<boolean>(false);
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
    if (updateMetadata) return;

    fetchDocumentUpdate(title, description, tags);
  }, [updateMetadata]);

  useEffect(() => {
    if (document) {
      setTitle(document.data.title as string);
      setDescription(document.data.blurb as string);
      setTags(document.data.tags as string[]);
    }

    return () => {
      pruneState();
    };
  }, [document]);

  function pruneState() {
    setTitle("");
    setDescription("");
    setTags([]);
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

  return (
    <>
      {notification && (
        <Notification type={notification.type} title={notification.title} message={notification.message} />
      )}

      <Suspense fallback={<Loader />}>
        {document ? (
          <>
            <div className="relative w-full pr-5 pl-5">
              <div className="relative w-full flex flex-row mb-4">
                <Button
                  title={updateMetadata ? "Save Changes" : "Edit Metadata"}
                  onClick={() => setUpdateMetadata(!updateMetadata)}
                  style="rounded"
                >
                  <span className="i-ic-outline-edit mr-2" />
                </Button>
              </div>

              <div className="relative w-full flex flex-row mb-4">
                {!updateMetadata && <PageHeader pageName={document.data.title as string} />}

                {updateMetadata && (
                  <Input
                    key="titleArticle"
                    type="text"
                    placeholder="Title"
                    disabled={readonlyMode}
                    value={title || ""}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                )}
              </div>

              <div className="relative w-full flex flex-row mb-4">
                {!updateMetadata && <p>{document.data.blurb as string}</p>}

                {updateMetadata && (
                  <TextArea
                    key="descriptionArticle"
                    placeholder="Description"
                    rows={3}
                    disabled={readonlyMode}
                    value={description || ""}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                )}
              </div>

              <div className="relative w-full flex flex-row gap-2">
                {!updateMetadata && tags.length > 0 && tags.map((tag, index) => <Badge key={index} title={tag} />)}

                {updateMetadata && (
                  <MultipleText placeholder="Add tags" value={tags} onChange={(value) => setTags(value)} />
                )}
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
          </>
        ) : (
          <Loader />
        )}
      </Suspense>
    </>
  );
}
