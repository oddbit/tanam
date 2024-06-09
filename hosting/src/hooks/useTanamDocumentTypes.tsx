import {TanamDocumentTypeClient} from "@/models/TanamDocumentTypeClient";
import {firestore} from "@/plugins/firebase";
import {collection, doc, onSnapshot} from "firebase/firestore";
import {useParams} from "next/navigation";
import {useEffect, useState} from "react";

interface TanamDocumentTypeHook {
  data: TanamDocumentTypeClient[];
  error: Error | null;
}

interface SingleTanamDocumentTypeHook {
  data: TanamDocumentTypeClient | null;
  error: Error | null;
}

/**
 * Hook to get a stream of Tanam document types
 *
 * @return {TanamDocumentTypeHook} Hook for document types subscription
 */
export function useTanamDocumentTypes(): TanamDocumentTypeHook {
  const [data, setData] = useState<TanamDocumentTypeClient[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const collectionRef = collection(firestore, "tanam-types");

    const unsubscribe = onSnapshot(
      collectionRef,
      (snapshot) => {
        const documentTypes = snapshot.docs.map((doc) => TanamDocumentTypeClient.fromFirestore(doc));
        setData(documentTypes);
      },
      (err) => {
        setError(err);
      },
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return {data, error};
}

/**
 * Hook to get a single Tanam document type
 *
 * @param {string?} documentTypeId Optional document type ID (default to content parameter from URL).
 * @return {SingleTanamDocumentTypeHook} Hook for single document type subscription
 */
export function useTanamDocumentType(documentTypeId?: string): SingleTanamDocumentTypeHook {
  const {documentTypeId: paramType} = useParams<{documentTypeId: string}>() ?? {
    documentTypeId: null,
  };
  const [data, setData] = useState<TanamDocumentTypeClient | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const typeId = documentTypeId ?? paramType;
    if (!typeId) {
      setData(null);
      return;
    }

    const docRef = doc(firestore, `tanam-types`, typeId);

    const unsubscribe = onSnapshot(
      docRef,
      (doc) => {
        if (doc.exists()) {
          setData(TanamDocumentTypeClient.fromFirestore(doc));
        } else {
          setError(new Error("Document type not found"));
        }
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
