import {TanamUserClient} from "@/models/TanamUserClient";
import {UserNotification} from "@/models/UserNotification";
import {firestore, storage} from "@/plugins/firebase";
import {doc, onSnapshot, updateDoc} from "firebase/firestore";
import {getDownloadURL, ref} from "firebase/storage";
import {useEffect, useState} from "react";

/**
 * Hook to get a Tanam user document from Firestore
 *
 * @param {string?} uid User ID
 * @return {UseTanamDocumentsResult} Hook for documents subscription
 */
export function useTanamUser(uid?: string) {
  const [tanamUser, setTanamUser] = useState<TanamUserClient | null>(null);
  const [error, setError] = useState<UserNotification | null>(null);

  useEffect(() => {
    if (!uid) {
      setTanamUser(null);
      return;
    }

    const docRef = doc(firestore, `tanam-users`, uid);
    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          setError(new UserNotification("error", "Access Denied", "Sorry you cant access the page"));
        }

        const tanamUser = TanamUserClient.fromFirestore(snapshot);
        setTanamUser(tanamUser);
      },
      (err) => {
        setError(new UserNotification("error", "Error fetching user", err.message));
      },
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [uid]);

  async function saveColorMode(colorMode: "dark" | "light") {
    if (!uid) {
      return;
    }

    try {
      const docRef = doc(firestore, `tanam-users`, uid);
      return updateDoc(docRef, {colorMode});
    } catch (error) {
      const typedError = error as Error;
      setError(new UserNotification("error", "Failed to set color mode to " + colorMode, typedError.message));
    }
  }

  return {tanamUser, saveColorMode, error};
}

interface UseProfileImageResult {
  imageUrl: string | null;
  error: UserNotification | null;
}

/**
 * Hook to get a profile image URL from Firebase Cloud Storage
 *
 * @param {string?} uid User ID
 * @return {UseProfileImageResult} Hook for profile image URL
 */
export function useTanamUserImage(uid?: string): UseProfileImageResult {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<UserNotification | null>(null);

  useEffect(() => {
    if (!uid) {
      setImageUrl(null);
      return;
    }

    const imageRef = ref(storage, `tanam-users/${uid}/profile.png`);
    console.log(`Fetching profile image for user ${uid}: ${imageRef}`);

    getDownloadURL(imageRef)
      .then((url) => {
        setImageUrl(url);
      })
      .catch((err) => {
        setError(new UserNotification("error", "Error fetching profile image", err.message));
      });
  }, [uid]);

  return {imageUrl, error};
}
