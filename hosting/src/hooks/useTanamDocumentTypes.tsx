import { firestore } from "@/firebase";
import { TanamDocumentType } from "@/models/tanamDocumentType";
import { collection, onSnapshot } from "firebase/firestore";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface TanamDocumentTypeHook {
  data: TanamDocumentType[];
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
