"use client";

import {UserNotification} from "@tanam/domain-frontend";
import {
  Button,
  DocumentTypeGenericList,
  FilePicker,
  Loader,
  Modal,
  Notification,
  PageHeader,
} from "@tanam/ui-components";
import {useRouter} from "next/navigation";
import {Suspense, useEffect, useState} from "react";
import {useAuthentication} from "../../../../hooks/useAuthentication";
import {ProcessingState, useGenkitArticle} from "../../../../hooks/useGenkitArticle";
import {useCrudTanamDocument, useTanamDocuments} from "../../../../hooks/useTanamDocuments";
import {useTanamDocumentType} from "../../../../hooks/useTanamDocumentTypes";
import {base64ToFile} from "../../../../plugins/fileUpload";

// I don't know why this component always errors
// when built because this component is still detected as a component rendered on the server.
// Even though I've used "use client" inside the component :(
const VoiceRecorder = dynamic(() => import("@tanam/ui-components";
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

  function resetAudioInput() {
    setAudio("");
    setIsDialogOpen(false);
    setIsRecording(false);
  }

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

  /**
   * Modal actions for saving or canceling audio input.
   * @constant
   * @type {JSX.Element}
   */
  const modalActionAudioInput = (
    <div className="flex flex-col sm:flex-row justify-end gap-3">
      {/* Start button to close the audio input modal */}
      <button
        className="flex justify-center rounded border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white sm:w-full sm:text-sm"
        onClick={resetAudioInput}
      >
        Close
      </button>
      {/* End button to close the audio input modal */}

      {/* Start button to save changes audio input */}
      <button
        className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90 sm:w-full sm:text-sm"
        onClick={submitAudio}
      >
        Save
      </button>
      {/* End button to save changes audio input */}
    </div>
  );

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
                    <button
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-black hover:bg-opacity-5 w-full text-left"
                      onClick={addNewArticle}
                    >
                      <span className="i-ic-create mr-2" />
                      {`Add New ${documentType.titleSingular.translated}`}
                    </button>
                    <button
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-black hover:bg-opacity-5 w-full text-left"
                      onClick={() => setIsDialogOpen(true)}
                    >
                      <span className="i-ic-mic mr-2" />
                      {`Record new ${documentType.titleSingular.translated}`}
                    </button>
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
              <Modal
                isOpen={isDialogOpen}
                disableOverlayClose={true}
                onClose={resetAudioInput}
                actions={modalActionAudioInput}
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
              </Modal>
            )}
          </>
        ) : (
          <Loader />
        )}
      </Suspense>
    </>
  );
}
