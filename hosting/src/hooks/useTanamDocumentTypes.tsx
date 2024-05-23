import {firestore} from "@/firebase"; // this is from you export an initialize the app
import {TanamDocumentType} from "@/models/TanamDocumentType";
import {collection, onSnapshot} from "firebase/firestore";

/**
 * Hooks for Tanam document types
 *
 * @param {string} site ID of the site
 * @return {Object} Tanam document types hooks
 */
export function useTanamDocumentTypes(site: string) {
  const collectionRef = collection(firestore, `tanam/${site}/document-types`);

  /**
   * Get a stream of document types
   *
   * @param {Function} callback
   * @return {Unsubscribe} An unsubscribe function that can be called to cancel
   * the snapshot listener.
   */
  function streamDocumentTypes(callback: (data: TanamDocumentType[]) => void) {
    return onSnapshot(collectionRef, (snapshot) => {
      const documentTypes = snapshot.docs.map((doc) =>
        TanamDocumentType.fromJson({
          id: doc.id,
          ...doc.data(),
        }),
      );
      callback(documentTypes);
    });
  }

  return {streamDocumentTypes};
}
