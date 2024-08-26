"use client";
import {TanamDocumentClient} from "@/models/TanamDocumentClient";
import {UserNotification} from "@/models/UserNotification";
import {firestore} from "@/plugins/firebase";
import {TanamPublishStatus} from "@functions/definitions/TanamPublishStatus";
import {collection, doc, onSnapshot, query, serverTimestamp, setDoc, updateDoc, where} from "firebase/firestore";
import {useEffect, useState} from "react";

interface UseTanamDocumentsResult {
  data: TanamDocumentClient[];
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
  const [data, setData] = useState<TanamDocumentClient[]>([]);
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
        const documents = snapshot.docs.map((doc) => TanamDocumentClient.fromFirestore(doc));
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
  data: TanamDocumentClient | null;
  changeStatus: (status: TanamPublishStatus) => Promise<void>;
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
  const [data, setData] = useState<TanamDocumentClient | null>(null);
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
        setData(TanamDocumentClient.fromFirestore(snapshot));
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
   * @return {Promise<void>} Promise
   */
  async function changeStatus(status: TanamPublishStatus): Promise<void> {
    if (!documentId) {
      setError(new UserNotification("error", "Missing parameter", "Document id parameter is missing"));
      return;
    }

    try {
      const typeRef = doc(firestore, "tanam-documents", documentId);
      await updateDoc(typeRef, {
        publishedAt: status === TanamPublishStatus.Published ? serverTimestamp() : null,
        status,
      } as Partial<TanamDocumentClient>);
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

      const tanamDocument = new TanamDocumentClient(docId, {data: {}, documentType});
      await setDoc(docRef, tanamDocument.toJson());
      return docId;
    } catch (err) {
      setError(
        new UserNotification("error", "Error creating document", "An error occurred while creating the document"),
      );
    }
    return null;
  }

  async function update(document: TanamDocumentClient): Promise<void> {
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
