import {TanamSiteClient} from "@/models/TanamSiteClient";
import {firestore} from "@/plugins/firebase";
import {ITanamSite} from "@functions/models/TanamSite";
import {Timestamp, doc, getDoc} from "firebase/firestore";
import {useParams} from "next/navigation";
import {useEffect, useState} from "react";

export function useTanamSite() {
  const {site} = useParams<{site: string}>() ?? {site: null};
  const [data, setSiteData] = useState<TanamSiteClient | null>(null);
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
        const data = snap.data() as ITanamSite<Timestamp>;
        setSiteData(TanamSiteClient.fromFirestore(snap));
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
