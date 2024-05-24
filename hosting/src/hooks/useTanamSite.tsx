import {useState, useEffect} from "react";
import {firestore} from "@/firebase";
import {doc, getDoc} from "firebase/firestore";
import {TanamSite} from "@/models/tanamSite";
import {useParams} from "next/navigation";

export function useTanamSite() {
  const {site} = useParams<{site: string}>() ?? {site: "-"};
  const [siteData, setSiteData] = useState<TanamSite | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!site) {
      // TODO(Dennis): Redirect to default site
      setError("No site parameter provided");
      return;
    }

    async function fetchSiteData() {
      try {
        const docRef = doc(firestore, "tanam", site);
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

    fetchSiteData();
  }, [site]);

  return {siteData, error};
}
