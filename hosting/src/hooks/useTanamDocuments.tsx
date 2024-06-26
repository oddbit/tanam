import {useParams} from "next/navigation";
import {TanamDocumentClient} from "@/models/TanamDocumentClient";
import {firestore} from "@/plugins/firebase";
import {ITanamDocument} from "@functions/models/TanamDocument";
import {
  Timestamp,
  collection,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
  limit,
  orderBy,
} from "firebase/firestore";
import {useEffect, useState} from "react";
import {UserNotification} from "@/models/UserNotification";

interface UseTanamDocumentsResult {
  data: TanamDocumentClient[];
  totalRecords: number;
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
  const [totalRecords, setTotalRecords] = useState<number>(0);
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
        setTotalRecords(snapshot.size);
        setData(documents);
      },
      (err) => {
        setError(new UserNotification("error", "Error fetching data", err.message));
      },
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [documentTypeId]);

  return {data, totalRecords, error};
}

type RecentField = "createdAt" | "updatedAt" | "publishedAt";
/**
 * Hook to get a stream of documents of a specific content type
 *
 * @param {RecentField} recentField Optional limit of documents to fetch (default to 10).
 * @param {number} numResults Optional limit of documents to fetch (default to 10).
 * @param {string?} documentTypeId Optional document type (default to content parameter from URL).
 * @return {UseTanamDocumentsResult} Hook for documents subscription
 */
export function useTanamRecentDocuments(
  recentField: RecentField,
  numResults = 10,
  documentTypeId?: string,
): UseTanamDocumentsResult {
  const {site} = useParams<{site: string}>() ?? {
    site: null,
  };
  const [data, setData] = useState<TanamDocumentClient[]>([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [error, setError] = useState<UserNotification | null>(null);

  useEffect(() => {
    if (!site) {
      setError(new UserNotification("error", "Missing parameter", "Site parameter is missing"));
      return;
    }

    const collectionRef = collection(firestore, `tanam/${site}/documents`);
    const queryConstraints = [];
    if (documentTypeId) {
      queryConstraints.push(where("documentType", "==", documentTypeId));
    }

    queryConstraints.push(orderBy(recentField, "desc"));
    queryConstraints.push(limit(numResults));

    const q = query(collectionRef, ...queryConstraints);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        console.log("Numm docs: ", snapshot.docs.length);
        const documents = snapshot.docs.map((doc) => TanamDocumentClient.fromFirestore(doc));
        console.info("documents :: ", documents);
        setTotalRecords(snapshot.size);
        setData(documents);
      },
      (err) => {
        setError(new UserNotification("error", "Something wrong", err.message));
      },
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [site]);

  return {data, totalRecords, error};
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
