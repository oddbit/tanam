import { TanamDocumentTypeClient } from "@/models/TanamDocumentTypeClient";
import { UserNotification } from "@/models/UserNotification";
import { firestore } from "@/plugins/firebase";
import { TanamDocumentField } from "@tanam/shared";
import { collection, doc, serverTimestamp, writeBatch } from "firebase/firestore";
import { useState } from "react";

interface CreateDocumentTypeHook {
  createType: (type: TanamDocumentTypeClient, fields: TanamDocumentField[]) => Promise<void>;
  isLoading: boolean;
  error: UserNotification | null;
}

/**
 * Custom hook for creating a new document type and its fields in Firestore.
 *
 * This hook provides a function to create a new document type in the "tanam-types" collection
 * and adds the associated fields in a subcollection under the document type. It manages the
 * loading state and any errors that occur during the creation process.
 *
 * @return {CreateDocumentTypeHook} - The hook provides the following:
 *   - createType: Function to create a new document type.
 *   - isLoading: Boolean indicating whether the creation process is ongoing.
 *   - error: UserNotification object if an error occurred during the creation process, otherwise null.
 */
export function useCreateDocumentType(): CreateDocumentTypeHook {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<UserNotification | null>(null);

  /**
   * Function to create a new document type and its fields in Firestore.
   *
   * This function creates a new document type in the "tanam-types" collection and adds the
   * associated fields in a subcollection under the document type. It uses a batch write to
   * ensure that all operations succeed or fail together, maintaining consistency.
   *
   * @param {TanamDocumentTypeClient} type - The document type to be created.
   * @param {TanamDocumentField[]} fields - An array of fields to be added under the document type.
   * @return {Promise<void>} - A promise that resolves when the batch operation completes
   * successfully. If any operation in the batch fails, the promise will be rejected.
   */
  const createType = async (type: TanamDocumentTypeClient, fields: TanamDocumentField[]): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const typeRef = doc(firestore, "tanam-types", type.id);
      const fieldsRef = collection(firestore, `tanam-types/${type.id}/fields`);
      const batch = writeBatch(firestore);
      batch.set(typeRef, {...type.toJson(), createdAt: serverTimestamp()});
      for (const field of fields) {
        batch.set(doc(fieldsRef, field.id), field.toJson());
      }
      await batch.commit();
    } catch (err) {
      console.error("Error creating document type", err);
      setError(new UserNotification("error", "Problem saving data", "Error creating document type"));
    } finally {
      setIsLoading(false);
    }
  };

  return {createType, isLoading, error};
}
