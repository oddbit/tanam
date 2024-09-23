"use client";
import {TanamDocument, TanamPublishStatus, UserNotification} from "@tanam/domain-frontend";
import {
  collection,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import {useEffect, useState} from "react";
import {firestore} from "../plugins/firebase";

interface UseTanamDocumentsResult {
  data: TanamDocument[];
  error: UserNotification | null;
  isLoading: boolean;
}

/**
 * Hook to get a stream of documents of a specific content type
 *
 * @param {string?} documentTypeId Document type
 * @return {UseTanamDocumentsResult} Hook for documents subscription
 */
export function useTanamDocuments(documentTypeId?: string): UseTanamDocumentsResult {
  const [data, setData] = useState<TanamDocument[]>([]);
  const [error, setError] = useState<UserNotification | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!documentTypeId) {
      setError(new UserNotification("error", "Missing parameter", "Content type parameter is missing"));
      setIsLoading(false);
      return;
    }

    const collectionRef = collection(firestore, `tanam-documents`);
    const q = query(collectionRef, where("documentType", "==", documentTypeId));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const documents = snapshot.docs.map((doc) => TanamDocument.fromFirestore(doc));
        setData(documents);
        setIsLoading(false);
      },
      (err) => {
        setError(new UserNotification("error", "Error fetching data", err.message));
        setIsLoading(false);
      },
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [documentTypeId]);

  return {data, error, isLoading};
}

interface UseTanamDocumentResult {
  data: TanamDocument | null;
  changeStatus: (status: TanamPublishStatus, publishedAt?: Date | null) => Promise<void>;
  error: UserNotification | null;
  isLoading: boolean;
}

/**
 * Hook to get a subscription for a single document
 *
 * @param {string?} documentId Document id
 * @return {UseTanamDocumentResult} Hook for document subscription
 */
export function useTanamDocument(documentId?: string): UseTanamDocumentResult {
  const [data, setData] = useState<TanamDocument | null>(null);
  const [error, setError] = useState<UserNotification | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!documentId) {
      setError(new UserNotification("error", "Missing parameter", "Document id parameter is missing"));
      setIsLoading(false);
      return;
    }
    const docRef = doc(firestore, "tanam-documents", documentId);
    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        setData(TanamDocument.fromFirestore(snapshot));
        setIsLoading(false);
      },
      (err) => {
        setError(new UserNotification("error", "Error fetching data", err.message));
        setIsLoading(false);
      },
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [documentId]);

  /**
   * Method to publish or unpublish a document
   *
   * @param {TanamPublishStatus} status Flag to publish or unpublish the document
   * @param {Date | null} publishedAt Time for publish document
   * @return {Promise<void>} Promise
   */
  async function changeStatus(status: TanamPublishStatus, publishedAt?: Date | null): Promise<void> {
    if (!documentId) {
      setError(new UserNotification("error", "Missing parameter", "Document id parameter is missing"));
      return;
    }

    try {
      const typeRef = doc(firestore, "tanam-documents", documentId);
      await updateDoc(typeRef, {
        publishedAt:
          status === TanamPublishStatus.Published || status === TanamPublishStatus.Scheduled
            ? publishedAt
              ? Timestamp.fromDate(publishedAt)
              : serverTimestamp()
            : null,
        status,
      } as Partial<TanamDocument>);
    } catch (err) {
      setError(
        new UserNotification("error", "Error publishing document", "An error occurred while publishing the document"),
      );
    }
  }

  return {data, changeStatus, error, isLoading};
}

export function useCrudTanamDocument() {
  const [error, setError] = useState<UserNotification | null>(null);

  async function create(documentType?: string) {
    try {
      if (!documentType) {
        setError(new UserNotification("error", "Missing parameter", "Document type parameter is missing"));
        return null;
      }
      const docRef = doc(collection(firestore, "tanam-documents"));
      const docId = docRef.id;

      await setDoc(docRef, TanamDocument.new(docId, documentType, {}).toJson());
      return docId;
    } catch (err) {
      setError(
        new UserNotification("error", "Error creating document", "An error occurred while creating the document"),
      );
    }
    return null;
  }

  async function update(document: TanamDocument): Promise<void> {
    try {
      const typeRef = doc(firestore, "tanam-documents", document.id);
      await updateDoc(typeRef, document.toJson());
    } catch (err) {
      setError(
        new UserNotification("error", "Error updating document", "An error occurred while updating the document"),
      );
    }
  }

  return {error, create, update};
}
