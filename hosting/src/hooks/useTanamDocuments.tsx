import {firestore} from "@/firebase";
import {TanamDocument} from "@/models/tanamDocument";
import {collection, onSnapshot, query, where} from "firebase/firestore";
import {useParams} from "next/navigation";
import {useEffect, useState} from "react";

interface UseTanamDocumentsResult {
  data: TanamDocument[];
  error: Error | null;
}

/**
 * Hook to get a stream of documents of a specific content type
 *
 * @param {string?} documentType Optional document type (default to content parameter from URL).
 * @return {UseTanamDocumentsResult} Hook for documents subscription
 */
export function useTanamDocuments(documentType?: string): UseTanamDocumentsResult {
  const {site, type: paramType} = useParams<{site: string; type: string}>() ?? {site: null, content: null};
  const type = documentType ?? paramType;
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
