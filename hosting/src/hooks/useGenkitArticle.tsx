import {TanamDocumentClient} from "@/models/TanamDocumentClient";
import {UserNotification} from "@/models/UserNotification";
import {firestore, storage} from "@/plugins/firebase";
import {TanamPublishStatus} from "@functions/models/TanamDocument";
import {collection, doc, setDoc} from "firebase/firestore";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {useState} from "react";
import {generateArticle} from "../genkit/article";

export enum ArticleCreationStatus {
  UploadingFile,
  GeneratingWithAI,
  Finalizing,
  Ready,
}

export function useGenkitArticle() {
  const [error, setError] = useState<UserNotification | null>(null);
  const [status, setStatus] = useState<ArticleCreationStatus | null>(ArticleCreationStatus.Ready);

  async function createFromRecording(file: File): Promise<string | null> {
    const docRef = doc(collection(firestore, "tanam-documents"));
    const docId = docRef.id;

    setStatus(ArticleCreationStatus.UploadingFile);
    const fileExt = file.name.substring(file.name.lastIndexOf("."));
    const fileName = Date.now().toString();
    const filePath = `tanam-documents/${docId}/GenAI/${fileName}${fileExt}`;

    try {
      console.log("Uploading file: " + filePath);
      const storageRef = ref(storage, filePath);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      setStatus(ArticleCreationStatus.GeneratingWithAI);
      const generatedArticle = await generateArticle({recordingUrl: downloadURL, length: 3});

      console.log("Generated article", generatedArticle);

      setStatus(ArticleCreationStatus.Finalizing);
      const tanamDocument = new TanamDocumentClient(docId, {
        documentType: "article",
        status: TanamPublishStatus.Unpublished,
        data: {
          title: generatedArticle.title,
          content: generatedArticle.content,
          tags: generatedArticle.tags,
          blurb: generatedArticle.blurb,
        },
      });
      await setDoc(docRef, tanamDocument.toJson());
      return docId;
    } catch (err) {
      setError(
        new UserNotification(
          "error",
          "Error generating article",
          "An error occurred while generating article from audio file.",
        ),
      );
    } finally {
      setStatus(ArticleCreationStatus.Ready);
    }
    return null;
  }

  return {error, status, createFromRecording};
}
