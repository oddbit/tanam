import {firestore} from "@/firebase";
import {TanamDocument} from "@/models/TanamDocument";
import {collection, doc, onSnapshot, query, where} from "firebase/firestore";
import {useParams} from "next/navigation";
import {useEffect, useState} from "react";

interface UseTanamDocumentsResult {
  data: TanamDocument[];
  error: Error | null;
}

/**
 * Hook to get a stream of documents of a specific content type
 *
 * @param {string?} documentTypeId Optional document type (default to content parameter from URL).
 * @return {UseTanamDocumentsResult} Hook for documents subscription
 */
export function useTanamDocuments(documentTypeId?: string): UseTanamDocumentsResult {
  const {site, documentTypeId: paramType} = useParams<{site: string; documentTypeId: string}>() ?? {
    site: null,
    documentTypeId: null,
  };
  const type = documentTypeId ?? paramType;
  const [data, setData] = useState<TanamDocument[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!site) {
      setError(new Error("Site parameter is missing"));
      return;
    }
    if (!type) {
      setError(new Error("Content type parameter is missing"));
      return;
    }

    const collectionRef = collection(firestore, `tanam/${site}/documents`);
    const q = query(collectionRef, where("documentType", "==", type));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const documents = snapshot.docs.map((doc) =>
          TanamDocument.fromJson({
            id: doc.id,
            ...doc.data(),
          }),
        );
        setData(documents);
      },
      (err) => {
        setError(err);
      },
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [site, type]);

  return {data, error};
}

interface UseTanamDocumentResult {
  data: TanamDocument | null;
  error: Error | null;
}

/**
 * Hook to get a subscription for a single document
 *
 * @param {string?} documentId Optional document id (default to content parameter from URL).
 * @return {UseTanamDocumentsResult} Hook for document subscription
 */
export function useTanamDocument(documentId?: string): UseTanamDocumentResult {
  const {site, documentId: paramId} = useParams<{site: string; documentId: string}>() ?? {site: null, documentId: null};
  const id = documentId ?? paramId;
  const [data, setData] = useState<TanamDocument | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!site) {
      setError(new Error("Site parameter is missing"));
      return;
    }
    if (!id) {
      setError(new Error("Document id parameter is missing"));
      return;
    }
    const docRef = doc(firestore, "tanam", site, "documents", id);
    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        setData(
          TanamDocument.fromJson({
            id: snapshot.id,
            ...snapshot.data(),
          }),
        );
      },
      (err) => {
        setError(err);
      },
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [site, paramId]);

  return {data, error};
}
