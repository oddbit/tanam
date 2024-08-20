import { storage } from "@/plugins/firebase";
import { base64ToBlob } from "@/utils/fileUpload";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useState } from "react";

/**
 * Hook for uploading base64 data to Firebase Storage.
 * @return {Object} - Returns an object with functions and states for uploading the file.
 */
export function useFirebaseStorage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Uploads a base64 encoded file to Firebase Storage.
   * @param {string} folderPath - Path in Firebase Storage where the file will be saved.
   * @param {string} base64 - Base64 encoded file string.
   * @param {string} fileName - The name for the uploaded file.
   * @param {string} contentType - MIME type of the file (e.g., 'image/jpeg', 'application/pdf').
   * @return {Promise<string | null>} - Returns a promise that resolves to the download URL of the uploaded file or null if failed.
   */
  async function upload(folderPath: string, base64: string, contentType: string) {
    setLoading(true);
    setError(null);

    console.info("upload :: ", folderPath)

    try {
      const blob = base64ToBlob(base64, contentType);

      // Create a reference to the file in Firebase Storage
      const storageRef = ref(storage, `${folderPath}`);
      await uploadBytes(storageRef, blob);
      console.info("upload finished")
      const downloadURL = await getFile(`${folderPath}`);

      setLoading(false);
      return downloadURL;
    } catch (err) {
      setError(`Upload failed: ${(err as Error).message}`);
      setLoading(false);
    }
  }

  /**
   * Gets the URL for a file stored in Firebase Storage.
   * @param {string} filePath - Path in Firebase Storage of the file.
   * @return {Promise<string | undefined>} - Returns a promise that resolves to the download URL or null if failed.
   */
  async function getFile(filePath: string): Promise<string | undefined> {
    try {
      const storageRef = ref(storage, filePath);
      const downloadURL = await getDownloadURL(storageRef);
      console.info("getFile :: ", downloadURL);
      return downloadURL;
    } catch (err) {
      setError(`Failed to get download URL: ${(err as Error).message}`);
    }
  }

  return { loading, error, upload, getFile };
}
