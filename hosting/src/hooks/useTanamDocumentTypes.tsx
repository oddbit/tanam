import { firestore } from "@/firebase"; // this is from you export an initialize the app
import { TanamDocumentType } from "@/models/TanamDocumentType";
import { TanamSite } from "@/models/tanamSite";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";

/**
 * Hooks for Tanam document types
 *
 * @param {string} site ID of the site
 * @returns {Object} Tanam document types hooks
 */
export function useTanamDocumentTypes(site: string) {
  const collectionRef = collection(firestore, `tanam/${site}/document-types`);

  /**
   * 
   * @param {Function} callback 
   * @returns 
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

  return { streamDocumentTypes };
}
