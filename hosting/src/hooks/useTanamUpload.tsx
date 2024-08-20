import { storage } from "@/plugins/firebase";
import { base64ToBlob, getFileExtension } from "@/utils/fileUpload";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useCallback, useState } from "react";

/**
 * Hook for uploading base64 data to Firebase Storage.
 * @param {string} folderPath - Path in Firebase Storage where the file will be saved.
 * @return {Object} - Returns an object with functions and states for uploading the file.
 */
export function useTanamUpload(folderPath: string) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Uploads a base64 encoded file to Firebase Storage.
   * @param {string} base64 - Base64 encoded file string.
   * @param {string} fileName - The name for the uploaded file.
   * @param {string} contentType - MIME type of the file (e.g., 'image/jpeg', 'application/pdf').
   * @return {Promise<string | null>} - Returns a promise that resolves to the download URL of the uploaded file or null if failed.
   */
  const upload = useCallback(async (base64: string, fileName: string, contentType: string) => {
    setLoading(true);
    setError(null);

    console.info("upload :: ", folderPath)

    try {
      // Extract file extension from contentType
      const fileExtension = getFileExtension(contentType);
      const fullFileName = `${fileName}${fileExtension}`;

      // Remove data URL prefix (e.g., 'data:image/jpeg;base64,')
      const base64Data = base64.split(',')[1];
      const blob = base64ToBlob(base64Data, contentType);
      const file = new File([blob], fileName);

      console.info("upload fullFileName :: ", fullFileName)
      console.info("upload file :: ", file)

      // Create a reference to the file in Firebase Storage
      const storageRef = ref(storage, `${folderPath}/${fileName}`);
      await uploadBytes(storageRef, file);
      console.info("upload finished")
      const downloadURL = await getDownloadURL(storageRef);

      setLoading(false);
      return downloadURL;
    } catch (err) {
      setError(`Upload failed: ${(err as Error).message}`);
      setLoading(false);
    }
  }, [folderPath]);

  return { loading, error, upload };
}
