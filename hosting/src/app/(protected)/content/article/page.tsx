"use client";
import {Button} from "@/components/Button";
import Loader from "@/components/common/Loader";
import Notification from "@/components/common/Notification";
import PageHeader from "@/components/common/PageHeader";
import Dialog from "@/components/Dialog";
import {DocumentTypeGenericList} from "@/components/DocumentType/DocumentTypeGenericList";
import FilePicker from "@/components/FilePicker";
import {useAuthentication} from "@/hooks/useAuthentication";
import {ProcessingState, useGenkitArticle} from "@/hooks/useGenkitArticle";
import {useCrudTanamDocument, useTanamDocuments} from "@/hooks/useTanamDocuments";
import {useTanamDocumentType} from "@/hooks/useTanamDocumentTypes";
import {UserNotification} from "@/models/UserNotification";
import {base64ToFile} from "@/plugins/fileUpload";
import dynamic from "next/dynamic";
import {useRouter} from "next/navigation";
import {Suspense, useEffect, useState} from "react";

// I don't know why this component always errors
// when built because this component is still detected as a component rendered on the server.
// Even though I've used "use client" inside the component :(
const VoiceRecorder = dynamic(() => import("@/components/VoiceRecorder"), {
  ssr: false,
});

export default function DocumentTypeDocumentsPage() {
  const router = useRouter();
  const {authUser} = useAuthentication();
  const {data: documentType} = useTanamDocumentType("article");
  const {create, error: crudError} = useCrudTanamDocument();
  const {data: documents, error: docsError, isLoading} = useTanamDocuments("article");
  const [notification, setNotification] = useState<UserNotification | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDropdownCreateOpen, setIsDropdownCreateOpen] = useState(false);
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

  async function submitAudio() {
    if (!audio) return;

    const file = base64ToFile(audio, `audio-${authUser?.uid}`);
    await handleFileSelect(file);
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
              <span className="relative">
                <Button
                  title={`Create ${documentType.titleSingular.translated}`}
                  onClick={() => setIsDropdownCreateOpen(!isDropdownCreateOpen)}
                  style="rounded"
                >
                  <span className="i-ic-add mr-2" />
                </Button>

                <div
                  className={`${isDropdownCreateOpen ? "block" : "hidden"} absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="dropdownCreateArticle"
                  tabIndex={-1}
                >
                  <div className="py-1" role="none">
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-black hover:bg-opacity-5"
                      onClick={addNewArticle}
                    >
                      <span className="i-ic-create mr-2" />
                      {`Add New ${documentType.titleSingular.translated}`}
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-black hover:bg-opacity-5"
                      onClick={() => setIsDialogOpen(true)}
                    >
                      <span className="i-ic-mic mr-2" />
                      {`Record new ${documentType.titleSingular.translated}`}
                    </a>
                  </div>
                </div>
              </span>
            </div>
          </div>
        ) : (
          <Loader />
        )}
      </Suspense>

      {notification && (
        <Notification type={notification.type} title={notification.title} message={notification.message} />
      )}

      <Suspense fallback={<Loader />}>
        {documentType ? (
          <>
            <DocumentTypeGenericList isLoading={isLoading} documents={documents} documentType={documentType} />

            {isDialogOpen && (
              <Dialog
                isOpen={isDialogOpen}
                onSubmit={submitAudio}
                onClose={() => setIsDialogOpen(false)}
                title={"Tell your story"}
              >
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
            )}
          </>
        ) : (
          <Loader />
        )}
      </Suspense>
    </>
  );
}
