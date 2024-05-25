import {useState, useEffect} from "react";
import {firestore} from "@/plugins/firebase";
import {TanamDocumentType} from "@/models/TanamDocumentType";
import {collection, onSnapshot} from "firebase/firestore";

interface TanamDocumentTypeHook {
  data: TanamDocumentType[];
  error: Error | null;
}

/**
 * Hook to get a stream of Tanam document types
 *
 * @param {string} site ID of the site
 * @return {TanamDocumentTypeHook} Hook for document types subscription
 */
export function useTanamDocumentTypes(site: string): TanamDocumentTypeHook {
  const [data, setData] = useState<TanamDocumentType[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
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
