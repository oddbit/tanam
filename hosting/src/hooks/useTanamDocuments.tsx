import {TanamDocumentClient} from "@/models/TanamDocumentClient";
import {firestore} from "@/plugins/firebase";
import {ITanamDocument} from "@functions/models/TanamDocument";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import {useEffect, useState} from "react";
import {UserNotification} from "@/models/UserNotification";

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

export function useCrudTanamDocument(documentId?: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<UserNotification | null>(null);

  async function update(data: Partial<ITanamDocument<Timestamp>>): Promise<void> {
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
  return {update, isLoading, error};
}

export function useCreateTanamDocument(documentType?: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<UserNotification | null>(null);

  async function create() {
    setIsLoading(true);
    try {
      if (!documentType) {
        setError(new UserNotification("error", "Missing parameter", "Document id parameter is missing"));
        return;
      }
      const typeRef = collection(firestore, "tanam-documents");
      const tanamDocument = new TanamDocumentClient("", {
        data: {content: ""},
        documentType,
        revision: 0,
      }).toJson();

      const result = await addDoc(typeRef, tanamDocument);
      return result;
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

  return {create, isLoading, error};
}
