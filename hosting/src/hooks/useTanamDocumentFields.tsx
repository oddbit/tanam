import {firestore} from "@/plugins/firebase";
import {ITanamDocumentField, TanamDocumentField} from "@functions/models/TanamDocumentField";
import {collection, onSnapshot} from "firebase/firestore";
import {useParams} from "next/navigation";
import {useEffect, useState} from "react";

interface TanamDocumentFieldHook {
  data: TanamDocumentField[];
  error: Error | null;
}

/**
 * Hook to get a stream of document fields of a specific content type
 *
 * @param {string?} documentTypeId Optional document type (default to content parameter from URL).
 * @return {TanamDocumentFieldHook} Hook for document types subscription
 */
export function useTanamDocumentFields(documentTypeId?: string): TanamDocumentFieldHook {
  const {site, documentTypeId: paramType} = useParams<{site: string; documentTypeId: string}>() ?? {
    site: null,
    documentTypeId: null,
  };
  const type = documentTypeId ?? paramType;
  const [data, setData] = useState<TanamDocumentField[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!site) {
      setError(new Error("No site parameter provided"));
      return;
    }
    if (!type) {
      setError(new Error("Content type parameter is missing"));
      return;
    }

    const collectionRef = collection(firestore, `tanam/${site}/document-types/${type}/fields`);

    const unsubscribe = onSnapshot(
      collectionRef,
      (snapshot) => {
        const documentTypes = snapshot.docs.map(
          (doc) => new TanamDocumentField(doc.id, doc.data() as ITanamDocumentField),
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
