"use client";
import {Button} from "@/components/Button";
import {Input} from "@/components/Form";
import Loader from "@/components/common/Loader";
import Notification from "@/components/common/Notification";
import PageHeader from "@/components/common/PageHeader";
import {useCrudTanamDocument, useTanamDocument} from "@/hooks/useTanamDocuments";
import {UserNotification} from "@/models/UserNotification";
// import dynamic from "next/dynamic";
import TiptapEditor from "@/components/Tiptap/TiptapEditor";
import {useParams, useRouter} from "next/navigation";
import {Suspense, useEffect, useState} from "react";

// TiptapEditor is also detected as ssr, even though it uses "use client" :(
// const TiptapEditor = dynamic(() => import("@/components/Tiptap/TiptapEditor"), {
//   ssr: false,
// });

export default function DocumentDetailsPage() {
  const router = useRouter();
  const {documentId} = useParams<{documentId: string}>() ?? {};
  const {data: document, error: documentError} = useTanamDocument(documentId);
  const {update, error: writeError} = useCrudTanamDocument();

  const [title, setTitle] = useState<string>("");
  const [readonlyMode] = useState<boolean>(false);
  const [updateTitleShown, setUpdateTitleShown] = useState<boolean>(false);
  const [notification, setNotification] = useState<UserNotification | null>(null);

  if (!!document?.documentType && document?.documentType !== "article") {
    router.push(`/content/${document?.documentType}/${document?.id}`);
    return <Loader />;
  }

  useEffect(() => {
    setNotification(documentError || writeError);
  }, [documentError, writeError]);

  useEffect(() => {
    if (updateTitleShown) return;

    onDocumentTitleChange(title);
  }, [updateTitleShown]);

  useEffect(() => {
    if (document) {
      setTitle(document.data.title as string);
    }

    return () => setTitle("");
  }, [document]);

  async function onDocumentTitleChange(title: string) {
    console.log("[onDocumentTitleChange]", title);
    if (!document) {
      return;
    }

    document.data.title = title;
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
            <div className="relative w-full flex flex-row gap-3">
              {!updateTitleShown && <PageHeader pageName={document.data.title as string} />}

              {updateTitleShown && (
                <Input
                  key="titleArticle"
                  type="text"
                  placeholder="Title"
                  disabled={readonlyMode}
                  value={title || ""}
                  onChange={(e) => setTitle(e.target.value)}
                />
              )}

              <Button
                title={updateTitleShown ? "Save Changes" : "Edit Title"}
                onClick={() => setUpdateTitleShown(!updateTitleShown)}
                style="rounded"
              >
                <span className="i-ic-outline-edit mr-2" />
              </Button>
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
