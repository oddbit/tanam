import {TanamDocumentClient} from "@tanam/cms/models/TanamDocumentClient";
import {UserNotification} from "@tanam/cms/models/UserNotification";
import {firestore, storage} from "@tanam/cms/plugins/firebase";
import {generateArticle} from "@tanam/cms/plugins/genkit/article";
import {ArticleSchema, TanamPublishStatus} from "@tanam/domain-shared";
import {collection, doc, getDocs, limit, orderBy, query, setDoc, where} from "firebase/firestore";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {useEffect, useState} from "react";

// NOTE: (Dennis) For some reason, the enum values are warning for not being used
export enum ProcessingState {
  // eslint-disable-next-line no-unused-vars
  Uploading,
  // eslint-disable-next-line no-unused-vars
  Processing,
  // eslint-disable-next-line no-unused-vars
  Generating,
  // eslint-disable-next-line no-unused-vars
  Finalizing,
  // eslint-disable-next-line no-unused-vars
  Ready,
}

export function useGenkitArticle() {
  const [error, setError] = useState<UserNotification | null>(null);
  const [status, setStatus] = useState<ProcessingState>(ProcessingState.Ready);

  useEffect(() => {
    console.log("[useGenkitArticle] " + status);
  }, [status]);

  async function createFromRecording(file: File): Promise<string | null> {
    const collRef = collection(firestore, "tanam-documents");
    const docRef = doc(collRef);
    const docId = docRef.id;

    setStatus(ProcessingState.Uploading);
    const fileExt = file.name.substring(file.name.lastIndexOf("."));
    const fileName = Date.now().toString();
    const filePath = `tanam-documents/${docId}/GenAI/${fileName}${fileExt}`;

    try {
      const storageRef = ref(storage, filePath);
      await uploadBytes(storageRef, file);

      setStatus(ProcessingState.Processing);
      const downloadURL = await getDownloadURL(storageRef);

      const querySnapshot = await getDocs(
        query(
          collRef,
          where("documentType", "==", "article"),
          where("status", "==", TanamPublishStatus.Published),
          orderBy("createdAt", "desc"),
          limit(10),
        ),
      );
      const articles = querySnapshot.docs
        .map((doc) => TanamDocumentClient.fromFirestore(doc))
        .map((tanamDoc) => ArticleSchema.parse(tanamDoc.data));

      setStatus(ProcessingState.Generating);
      const generatedArticle = await generateArticle({
        recordingUrl: downloadURL,
        length: 3,
        sampleArticles: articles,
      });

      setStatus(ProcessingState.Finalizing);
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
      console.error(err);
      setError(
        new UserNotification(
          "error",
          "Error generating article",
          "An error occurred while generating article from audio file.",
        ),
      );
    } finally {
      setStatus(ProcessingState.Ready);
    }
    return null;
  }

  return {error, status, createFromRecording};
}
