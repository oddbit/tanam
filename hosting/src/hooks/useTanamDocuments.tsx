import {TanamDocumentClient} from "@/models/TanamDocumentClient";
import {firestore} from "@/plugins/firebase";
import {collection, doc, onSnapshot, query, where} from "firebase/firestore";
import {useParams} from "next/navigation";
import {useEffect, useState} from "react";

interface UseTanamDocumentsResult {
  data: TanamDocumentClient[];
  error: Error | null;
}

/**
 * Hook to get a stream of documents of a specific content type
 *
 * @param {string?} documentTypeId Optional document type (default to content parameter from URL).
 * @return {UseTanamDocumentsResult} Hook for documents subscription
 */
export function useTanamDocuments(documentTypeId?: string): UseTanamDocumentsResult {
  const {documentTypeId: paramType} = useParams<{documentTypeId: string}>() ?? {
    documentTypeId: null,
  };
  const [data, setData] = useState<TanamDocumentClient[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const type = documentTypeId ?? paramType;
    if (!type) {
      setError(new Error("Content type parameter is missing"));
      return;
    }

    const collectionRef = collection(firestore, `tanam-documents`);
    const q = query(collectionRef, where("documentType", "==", type));

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
  }, [documentTypeId, paramType]);

  return {data, error};
}

interface UseTanamDocumentResult {
  data: TanamDocumentClient | null;
  error: Error | null;
}

/**
 * Hook to get a subscription for a single document
 *
 * @param {string?} documentId Optional document id (default to content parameter from URL).
 * @return {UseTanamDocumentsResult} Hook for document subscription
 */
export function useTanamDocument(documentId?: string): UseTanamDocumentResult {
  const {documentId: paramId} = useParams<{documentId: string}>() ?? {documentId: null};
  const [data, setData] = useState<TanamDocumentClient | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const docId = documentId ?? paramId;
    if (!docId) {
      setError(new Error("Document id parameter is missing"));
      return;
    }
    const docRef = doc(firestore, "tanam-documents", docId);
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
  }, [documentId, paramId]);

  return {data, error};
}
