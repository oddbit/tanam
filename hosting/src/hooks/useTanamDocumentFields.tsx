import {firestore} from "@/plugins/firebase";
import {ITanamDocumentField, TanamDocumentField} from "@functions/models/TanamDocumentField";
import {collection, onSnapshot} from "firebase/firestore";
import {useParams} from "next/navigation";
import {useEffect, useState} from "react";
import {UserNotification} from "@/models/UserNotification";

interface TanamDocumentFieldHook {
  data: TanamDocumentField[];
  totalRecords: number;
  error: UserNotification | null;
}

/**
 * Hook to get a stream of document fields of a specific content type
 *
 * @param {string?} documentTypeId Optional document type (default to content parameter from URL).
 * @return {TanamDocumentFieldHook} Hook for document types subscription
 */
export function useTanamDocumentFields(documentTypeId?: string): TanamDocumentFieldHook {
  const {documentTypeId: paramType} = useParams<{documentTypeId: string}>() ?? {
    documentTypeId: null,
  };
  const [data, setData] = useState<TanamDocumentField[]>([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [error, setError] = useState<UserNotification | null>(null);

  useEffect(() => {
    const type = documentTypeId ?? paramType;
    if (!type) {
      setError(new UserNotification("error", "Missing parameter", "Content type parameter is missing"));
      return;
    }

    const collectionRef = collection(firestore, `tanam-types/${type}/fields`);

    const unsubscribe = onSnapshot(
      collectionRef,
      (snapshot) => {
        const documentTypes = snapshot.docs.map(
          (doc) => new TanamDocumentField(doc.id, doc.data() as ITanamDocumentField),
        );
        setTotalRecords(snapshot.size);
        setData(documentTypes);
      },
      (err) => {
        setError(new UserNotification("error", "Error fetching data", err.message));
      },
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [documentTypeId, paramType]);

  return {data, totalRecords, error};
}
