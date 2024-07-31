"use client";
import {TanamDocumentClient} from "@/models/TanamDocumentClient";
import {UserNotification} from "@/models/UserNotification";
import {firestore} from "@/plugins/firebase";
import {ITanamDocument} from "@functions/models/TanamDocument";
import {
  Timestamp,
  collection,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import {useEffect, useState} from "react";

interface UseTanamDocumentsResult {
  data: TanamDocumentClient[];
  error: UserNotification | null;
}

/**
 * Hook to get a stream of documents of a specific content type
 *
 * @param {string?} documentTypeId Document type
 * @return {UseTanamDocumentsResult} Hook for documents subscription
 */
export function useTanamDocuments(documentTypeId?: string): UseTanamDocumentsResult {
  const [data, setData] = useState<TanamDocumentClient[]>([]);
  const [error, setError] = useState<UserNotification | null>(null);

  useEffect(() => {
    if (!documentTypeId) {
      setError(new UserNotification("error", "Missing parameter", "Content type parameter is missing"));
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
        setError(new UserNotification("error", "Error fetching data", err.message));
      },
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [documentTypeId]);

  return {data, error};
}

interface UseTanamDocumentResult {
  data: TanamDocumentClient | null;
  error: UserNotification | null;
}

/**
 * Hook to get a subscription for a single document
 *
 * @param {string?} documentId Document id
 * @return {UseTanamDocumentsResult} Hook for document subscription
 */
export function useTanamDocument(documentId?: string): UseTanamDocumentResult {
  const [data, setData] = useState<TanamDocumentClient | null>(null);
  const [error, setError] = useState<UserNotification | null>(null);

  useEffect(() => {
    if (!documentId) {
      setError(new UserNotification("error", "Missing parameter", "Document id parameter is missing"));
      return;
    }
    const docRef = doc(firestore, "tanam-documents", documentId);
    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        setData(TanamDocumentClient.fromFirestore(snapshot));
      },
      (err) => {
        setError(new UserNotification("error", "Error fetching data", err.message));
      },
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [documentId]);

  return {data, error};
}

export function useCrudTanamDocument() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<UserNotification | null>(null);

  async function create(documentType?: string) {
    setIsLoading(true);
    try {
      if (!documentType) {
        setError(new UserNotification("error", "Missing parameter", "Document type parameter is missing"));
        return;
      }
      const docRef = doc(collection(firestore, "tanam-documents"));
      const docId = docRef.id;

      const tanamDocument = new TanamDocumentClient(docId, {data: {}, documentType});
      await setDoc(docRef, tanamDocument.toJson());
      return docId;
    } catch (err) {
      setError(
        new UserNotification(
          "error",
          "UserNotification creating document",
          "An error occurred while creating the document",
        ),
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function update(documentId: string, data: Partial<ITanamDocument<Timestamp>>): Promise<void> {
    setIsLoading(true);
    try {
      if (!documentId) {
        setError(new UserNotification("error", "Missing parameter", "Document id parameter is missing"));
        return;
      }

      const typeRef = doc(firestore, "tanam-documents", documentId);
      await updateDoc(typeRef, {...data, updatedAt: serverTimestamp()});
    } catch (err) {
      setError(
        new UserNotification(
          "error",
          "UserNotification updating document",
          "An error occurred while updating the document",
        ),
      );
    } finally {
      setIsLoading(false);
    }
  }
  return {isLoading, error, create, update};
}
