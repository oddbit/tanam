import {useState, useEffect} from "react";
import {firestore} from "@/firebase";
import {collection, query, where, onSnapshot} from "firebase/firestore";
import {useParams} from "next/navigation";
import {TanamDocument} from "@/models/tanamDocument";

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
  const {site, content} = useParams<{site: string; content: string}>() ?? {site: null, content: null};
  const type = documentType ?? content;
  const [data, setData] = useState<TanamDocument[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!site || !type) {
      setError(new Error("Site or content parameter is missing"));
      return;
    }

    const collectionRef = collection(firestore, "tanam/documents");
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
  }, [site, content]);

  return {data, error};
}
