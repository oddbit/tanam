import {  doc, getDoc } from "firebase/firestore";
import {useFirebase} from "../firebase";
import { TanamSite } from '../models/tanamSite';


/**
 * Get Tanam site information
 * 
 * @param {string} siteId Tanam site id
 * @returns {TanamSite | null} Tanam site data
 */
export async function getSiteData(siteId: string): Promise<TanamSite | null>  {
  const { firestore } = useFirebase();
  const siteDoc = doc(firestore, "tanam", siteId);
  const siteSnapshot = await getDoc(siteDoc);
  console.log(JSON.stringify(siteSnapshot.data(), null, 2));
  if (!siteSnapshot.exists()) {
    return null;
  }
  return TanamSite.fromJson(siteSnapshot.data());
}
