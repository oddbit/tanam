"use client";
import {AcceptFileType, UserNotification} from "@tanam/domain-frontend";
import {Button, DocumentTypeGenericList, Loader, Modal, Notification, PageHeader} from "@tanam/ui-components";
import {useRouter} from "next/navigation";
import {Suspense, useEffect, useState} from "react";
import {Dropzone} from "../../../../components/Form/Dropzone";
import VoiceRecorder from "../../../../components/VoiceRecorder";
import {useAuthentication} from "../../../../hooks/useAuthentication";
import {ProcessingState, useGenkitArticle} from "../../../../hooks/useGenkitArticle";
import {useCrudTanamDocument, useTanamDocuments} from "../../../../hooks/useTanamDocuments";
import {useTanamDocumentType} from "../../../../hooks/useTanamDocumentTypes";
import {base64ToFile} from "../../../../plugins/fileUpload";

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
      <Button onClick={resetAudioInput} style="outline-rounded" className={["text-black dark:text-white"]}>
        Close
      </Button>
      {/* End button to close the audio input modal */}

      {/* Start button to save changes audio input */}
      <Button onClick={submitAudio} style="rounded" className={["text-black dark:text-white"]}>
        Save
      </Button>
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
                  className={`${isDropdownCreateOpen ? "block" : "hidden"} absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-black shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="dropdownCreateArticle"
                  tabIndex={-1}
                >
                  <div className="py-1" role="none">
                    <button
                      className="block px-4 py-2 text-sm text-black dark:text-white bg-white dark:bg-black hover:opacity-70 dark:hover:opacity-70 w-full text-left"
                      onClick={addNewArticle}
                    >
                      <span className="i-ic-create mr-2" />
                      {`Add New ${documentType.titleSingular.translated}`}
                    </button>
                    <button
                      className="block px-4 py-2 text-sm text-black dark:text-white bg-white dark:bg-black hover:opacity-70 dark:hover:opacity-70 w-full text-left"
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

                        <Dropzone
                          accept={AcceptFileType.Audios}
                          onChange={(_, fileBlob) => {
                            if (!fileBlob) return;

                            handleFileSelect(fileBlob);
                          }}
                        />
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
