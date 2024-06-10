import {TanamDocumentClient} from "@/models/TanamDocumentClient";
import {firestore} from "@/plugins/firebase";
import {Timestamp, collection, doc, onSnapshot, query, serverTimestamp, updateDoc, where} from "firebase/firestore";
import {useEffect, useState} from "react";
import {ITanamDocumentType} from "../../../functions/src/models/TanamDocumentType";

interface UseTanamDocumentsResult {
  data: TanamDocumentClient[];
  error: Error | null;
}

/**
 * Hook to get a stream of documents of a specific content type
 *
 * @param {string?} documentTypeId Document type
 * @return {UseTanamDocumentsResult} Hook for documents subscription
 */
export function useTanamDocuments(documentTypeId?: string): UseTanamDocumentsResult {
  const [data, setData] = useState<TanamDocumentClient[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!documentTypeId) {
      setError(new Error("Content type parameter is missing"));
      return;
    }

    const collectionRef = collection(firestore, `tanam-documents`);
    const q = query(collectionRef, where("documentType", "==", documentTypeId));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const documents = snapshot.docs.map((doc) => TanamDocumentClient.fromFirestore(doc));
        setData(documents);
      },
      (err) => {
        setError(err);
      },
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [documentTypeId]);

  return {data, error};
}

interface UseTanamDocumentResult {
  data: TanamDocumentClient | null;
  error: Error | null;
}

/**
 * Hook to get a subscription for a single document
 *
 * @param {string?} documentId Document id
 * @return {UseTanamDocumentsResult} Hook for document subscription
 */
export function useTanamDocument(documentId?: string): UseTanamDocumentResult {
  const [data, setData] = useState<TanamDocumentClient | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!documentId) {
      setError(new Error("Document id parameter is missing"));
      return;
    }
    const docRef = doc(firestore, "tanam-documents", documentId);
    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        setData(TanamDocumentClient.fromFirestore(snapshot));
      },
      (err) => {
        setError(err);
      },
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [documentId]);

  return {data, error};
}

export function useCrudTanamDocument(documentId?: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  async function update(data: Partial<ITanamDocumentType<Timestamp>>): Promise<void> {
    setIsLoading(true);
    try {
      if (!documentId) {
        throw new Error("Document ID is missing");
      }

      const typeRef = doc(firestore, "tanam-documents", documentId);
      await updateDoc(typeRef, {...data, updatedAt: serverTimestamp()});
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }

  return {update, isLoading, error};
}
