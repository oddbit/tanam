import {useState, useEffect} from "react";
import {firestore} from "@/plugins/firebase";
import {TanamDocumentType} from "@/models/TanamDocumentType";
import {collection, doc, onSnapshot} from "firebase/firestore";
import {useParams} from "next/navigation";

interface TanamDocumentTypeHook {
  data: TanamDocumentType[];
  error: Error | null;
}

interface SingleTanamDocumentTypeHook {
  data: TanamDocumentType | null;
  error: Error | null;
}

/**
 * Hook to get a stream of Tanam document types
 *
 * @return {TanamDocumentTypeHook} Hook for document types subscription
 */
export function useTanamDocumentTypes(): TanamDocumentTypeHook {
  const {site} = useParams<{site: string}>() ?? {site: null};
  const [data, setData] = useState<TanamDocumentType[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!site) {
      setError(new Error("No site parameter provided"));
      return;
    }

    const collectionRef = collection(firestore, `tanam/${site}/document-types`);

    const unsubscribe = onSnapshot(
      collectionRef,
      (snapshot) => {
        const documentTypes = snapshot.docs.map((doc) =>
          TanamDocumentType.fromJson({
            id: doc.id,
            ...doc.data(),
          }),
        );
        setData(documentTypes);
      },
      (err) => {
        setError(err);
      },
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [site]);

  return {data, error};
}

/**
 * Hook to get a single Tanam document type
 *
 * @param {string?} documentTypeId Optional document type ID (default to content parameter from URL).
 * @return {SingleTanamDocumentTypeHook} Hook for single document type subscription
 */
export function useTanamDocumentType(documentTypeId?: string): SingleTanamDocumentTypeHook {
  const {site, documentTypeId: paramType} = useParams<{site: string; documentTypeId: string}>() ?? {
    site: null,
    documentTypeId: null,
  };
  const typeId = documentTypeId ?? paramType;
  const [data, setData] = useState<TanamDocumentType | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!site) {
      setError(new Error("No site parameter provided"));
      return;
    }
    if (!typeId) {
      setData(null);
      return;
    }

    const docRef = doc(firestore, `tanam/${site}/document-types`, typeId);

    const unsubscribe = onSnapshot(
      docRef,
      (doc) => {
        if (doc.exists()) {
          setData(TanamDocumentType.fromJson({id: doc.id, ...doc.data()}));
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
  }, [site, typeId]);

  return {data, error};
}
