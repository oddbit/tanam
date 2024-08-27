"use client";
import {Button} from "@/components/Button";
import Dialog from "@/components/Dialog";
import {DocumentTypeGenericList} from "@/components/DocumentType/DocumentTypeGenericList";
import FilePicker from "@/components/FilePicker";
import {VoiceRecorder} from "@/components/VoiceRecorder";
import Loader from "@/components/common/Loader";
import Notification from "@/components/common/Notification";
import PageHeader from "@/components/common/PageHeader";
import {ProcessingState, useGenkitArticle} from "@/hooks/useGenkitArticle";
import {useTanamDocumentType} from "@/hooks/useTanamDocumentTypes";
import {useCrudTanamDocument, useTanamDocuments} from "@/hooks/useTanamDocuments";
import {UserNotification} from "@/models/UserNotification";
import {useRouter} from "next/navigation";
import {Suspense, useEffect, useState} from "react";

export default function DocumentTypeDocumentsPage() {
  const router = useRouter();
  const {data: documentType} = useTanamDocumentType("article");
  const {create, error: crudError} = useCrudTanamDocument();
  const {data: documents, error: docsError, isLoading} = useTanamDocuments("article");
  const [notification, setNotification] = useState<UserNotification | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [audio, setAudio] = useState<string>("");
  const {createFromRecording, status} = useGenkitArticle();

  useEffect(() => {
    setNotification(docsError || crudError);
  }, [docsError, crudError]);

  async function addNewArticle() {
    if (!documentType) return;
    const id = await create(documentType.id);
    if (!id) return;
    router.push(`article/${id}`);
  }

  async function handleFileSelect(file: File) {
    console.log(file);
    const articleId = await createFromRecording(file);
    setIsDialogOpen(false);
    if (articleId) router.push(`article/${articleId}`);
  }

  return (
    <>
      <Suspense fallback={<Loader />}>
        {documentType ? (
          <div className="flex items-center gap-4">
            <PageHeader pageName={documentType.titlePlural.translated} />
            <div className="mb-6">
              <Button
                title={`Add New ${documentType.titleSingular.translated}`}
                onClick={addNewArticle}
                style="rounded"
              />
              <Button
                title={`Record new ${documentType.titleSingular.translated}`}
                onClick={() => setIsDialogOpen(true)}
                style="rounded"
              />
            </div>
          </div>
        ) : (
          <Loader />
        )}
      </Suspense>
      <Dialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} title={"Tell your story"}>
        {status === ProcessingState.Ready ? (
          <>
            <VoiceRecorder value={audio} onChange={setAudio} onLoadingChange={setIsRecording} />

            {!isRecording && !audio && (
              <>
                <div className="relative w-full text-center mt-4 mb-4">Or</div>

                <FilePicker onFileSelect={handleFileSelect} />
              </>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 space-y-2">
            <Loader />
            {status === ProcessingState.Uploading && <p>Uploading file...</p>}
            {status === ProcessingState.Processing && <p>Preparing...</p>}
            {status === ProcessingState.Generating && <p>Generating with AI...</p>}
            {status === ProcessingState.Finalizing && <p>Finalizing...</p>}
          </div>
        )}
      </Dialog>

      {notification && (
        <Notification type={notification.type} title={notification.title} message={notification.message} />
      )}

      <Suspense fallback={<Loader />}>
        {documentType ? (
          <DocumentTypeGenericList isLoading={isLoading} documents={documents} documentType={documentType} />
        ) : (
          <Loader />
        )}
      </Suspense>
    </>
  );
}
