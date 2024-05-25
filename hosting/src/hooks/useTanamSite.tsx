import {firestore} from "@/firebase";
import {TanamSite} from "@/models/TanamSite";
import {doc, getDoc} from "firebase/firestore";
import {useParams} from "next/navigation";
import {useEffect, useState} from "react";

export function useTanamSite() {
  const {site} = useParams<{site: string}>() ?? {site: null};
  const [data, setSiteData] = useState<TanamSite | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (site) {
      fetchSiteData(site);
    } else {
      // TODO(Dennis): Redirect to default site ?
      setError("No site parameter provided");
      return;
    }
  }, [site]);

  async function fetchSiteData(siteId: string) {
    try {
      const docRef = doc(firestore, "tanam", siteId);
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        const data = {
          ...snap.data(),
          id: snap.id,
        };
        setSiteData(TanamSite.fromJson(data));
      } else {
        setError("Site not found");
      }
    } catch (err) {
      console.error("Error fetching site data:", err);
      setError("No permission to read site data or site not found");
    }
  }

  return {data, error};
}
