"use client";
import {AcceptFileType, UserNotification} from "@tanam/domain-frontend";
import {Button, DocumentTypeGenericList, Loader, Modal, Notification, PageHeader} from "@tanam/ui-components";
import {useRouter} from "next/navigation";
import {Suspense, useEffect, useState} from "react";
import {Dropzone} from "../../../../components/Form/Dropzone";
import VoiceRecorder from "../../../../components/VoiceRecorder";
import {useAuthentication} from "../../../../hooks/useAuthentication";
import {useFirebaseStorage} from "../../../../hooks/useFirebaseStorage";
import {useCrudTanamDocument, useTanamDocuments} from "../../../../hooks/useTanamDocuments";
import {useTanamDocumentType} from "../../../../hooks/useTanamDocumentTypes";
import {base64ToFile} from "../../../../plugins/fileUpload";
import {generateArticle} from "../../../../plugins/genkit";

enum ProcessingState {
  Uploading = "Uploading",
  Processing = "Processing",
  Generating = "Generating",
  Finalizing = "Finalizing",
  Ready = "Ready",
}

export default function DocumentTypeDocumentsPage() {
  const router = useRouter();
  const {data: documentType} = useTanamDocumentType("article");
  const {create, update, error: crudError} = useCrudTanamDocument();
  const {data: documents, error: docsError, isLoading} = useTanamDocuments("article");
  const [notification, setNotification] = useState<UserNotification | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDropdownCreateOpen, setIsDropdownCreateOpen] = useState(false);
  const [audio, setAudio] = useState<string>("");
  const [status, setStatus] = useState<ProcessingState>(ProcessingState.Ready);
  const {upload} = useFirebaseStorage();
  const {authUser} = useAuthentication();

  useEffect(() => {
    setNotification(docsError || crudError);
  }, [docsError, crudError]);

  function resetAudioInput() {
    setAudio("");
    setIsDialogOpen(false);
    setIsRecording(false);
  }

  /**
   * Adds a new article to the database and navigates to the new article page.
   *
   * @return {Promise<void>}
   */
  async function addNewArticle() {
    if (!documentType) return;
    const document = await create(documentType.id);
    if (!document) {
      setNotification(
        new UserNotification(
          "error",
          "Problem creating article",
          "Something went wrong while generating article. Try again.",
        ),
      );
      return;
    }

    router.push(`article/${document.id}`);
  }

  /**
   * Submits the audio input to the server for processing.
   *
   * @return {Promise<void>}
   */
  async function submitAudio() {
    if (!audio) {
      setNotification(
        new UserNotification(
          "error",
          "Problem generating audio file",
          "Something went wrong while recording audio. Try again.",
        ),
      );
      return;
    }

    const file = base64ToFile(audio, `${crypto.randomUUID()}.wav`);
    await handleFileSelect(file);
  }

  /**
   * Handles the file select event by uploading the file to storage and creating
   * a new article with LLM.
   *
   * @param {File} file - The file to be processed
   * @return {Promise<void>}
   */
  async function handleFileSelect(file: File) {
    if (!documentType) return;
    setStatus(ProcessingState.Processing);
    try {
      // Create a new empty article to write the article to
      const document = await create(documentType.id);
      if (!document) {
        throw new Error("Failed to create article");
      }

      // Make a random file name for the audio file so that it is possible
      // to upload multiple files without overwriting each other
      const fileExt = file.name.substring(file.name.lastIndexOf("."));
      const fileName = crypto.randomUUID();
      const filePath = `tanam-documents/${document.id}/GenAI/${fileName}${fileExt}`;
      setStatus(ProcessingState.Uploading);

      // Upload the file to storage and get a download URL for the LLM to use
      const downloadUrl = await upload(filePath, file);
      if (!downloadUrl) {
        throw new Error("Failed to upload file to storage");
      }
      setStatus(ProcessingState.Generating);

      // Generate the article with LLM
      if (!authUser) {
        throw new Error("User not authenticated");
      }
      document.data = await generateArticle(downloadUrl, 3);

      setStatus(ProcessingState.Processing);
      await update(document);

      // Open the new article page
      router.push(`article/${document.id}`);
    } catch (error) {
      console.error(error);
      setNotification(
        new UserNotification(
          "error",
          "Problem creating article",
          "Something went wrong while generating article. Try again.",
        ),
      );
    } finally {
      setStatus(ProcessingState.Ready);
      setIsDialogOpen(false);
    }
  }

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
          <div className="relative w-full flex gap-2 mb-4">
            <PageHeader pageName={documentType.titlePlural.translated} />

            <div className="relative">
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
                    {status === ProcessingState.Processing && <p>Preparing...</p>}
                    {status === ProcessingState.Uploading && <p>Uploading file...</p>}
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
