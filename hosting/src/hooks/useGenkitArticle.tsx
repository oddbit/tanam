import {generateArticle} from "@/genkit/article";
import {ProcessingState} from "@/models/ProcessingState";
import {TanamDocumentClient} from "@/models/TanamDocumentClient";
import {UserNotification} from "@/models/UserNotification";
import {firestore, storage} from "@/plugins/firebase";
import {TanamPublishStatus} from "@functions/models/TanamDocument";
import {ArticleSchema} from "@functions/schemas/article";
import {collection, doc, getDocs, limit, orderBy, query, setDoc, where} from "firebase/firestore";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {useEffect, useState} from "react";

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
        publishedAt: undefined,
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
