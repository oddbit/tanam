import { firestore } from "@/firebase"; // this is from you export an initialize the app
import { doc, getDoc } from "firebase/firestore";
import { TanamSite } from "../models/tanamSite";

/**
 * Hook for Tanam site
 *
 * @param {stirng} site ID of the site
 * @returns {Object} Tanam site hooks
 */
export function useTanamSite(site: string) {
  /**
   * Get Tanam site data
   *
   * @returns {Promise<TanamSite | null>} Tanam site data
   */
  async function getSite(): Promise<TanamSite | null> {
    const docRef = doc(firestore, "tanam", site);
    const snap = await getDoc(docRef);

    if (!snap.exists()) {
      return null;
    }

    const data = {
      ...snap.data(),
      id: snap.id,
    };

    return TanamSite.fromJson(data);
  }

  return { getSite };
}
