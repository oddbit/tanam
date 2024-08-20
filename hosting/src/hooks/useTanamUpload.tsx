import { storage } from "@/plugins/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useCallback, useState } from "react";

/**
 * Hook for uploading base64 data to Firebase Storage.
 * @param {string} folderPath - Path in Firebase Storage where the file will be saved.
 * @return {Object} - Returns an object with functions and states for uploading the file.
 */
export function useTanamUpload(folderPath: string) {
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Uploads a base64 encoded file to Firebase Storage.
   * @param {string} base64 - Base64 encoded file string.
   * @param {string} fileName - The name for the uploaded file.
   * @param {string} contentType - MIME type of the file (e.g., 'image/jpeg', 'application/pdf').
   * @return {Promise<string | null>} - Returns a promise that resolves to the download URL of the uploaded file or null if failed.
   */
  const upload = useCallback(async (base64: string, fileName: string, contentType: string) => {
    setUploading(true);
    setError(null);

    try {
      // Extract file extension from contentType
      const fileExtension = getFileExtension(contentType);
      const fullFileName = `${fileName}${fileExtension}`;

      // Remove data URL prefix (e.g., 'data:image/jpeg;base64,')
      const base64Data = base64.split(',')[1];
      const blob = base64ToBlob(base64Data, contentType);
      const file = new File([blob], fullFileName);

      // Create a reference to the file in Firebase Storage
      const storageRef = ref(storage, `${folderPath}/${fullFileName}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      setUploading(false);
      return downloadURL;
    } catch (err) {
      setError(`Upload failed: ${(err as Error).message}`);
      setUploading(false);
    }
  }, [folderPath]);

  return { uploading, error, upload };
}

/**
 * Converts a base64 string to a Blob object.
 * @param {string} base64 - Base64 string of the file.
 * @param {string} contentType - MIME type of the file (e.g., 'image/jpeg', 'application/pdf').
 * @return {Blob} - The Blob object created from the base64 string.
 */
export function base64ToBlob(base64: string, contentType: string) {
  const sliceSize = 512;
  const byteCharacters = atob(base64);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);

    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
};

/**
 * Gets the file extension based on the MIME type.
 * @param {string} contentType - MIME type of the file (e.g., 'image/jpeg', 'application/pdf').
 * @return {string} - File extension based on MIME type.
 */
export function getFileExtension(contentType: string) {
  const mimeTypeToExtension: { [key: string]: string } = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'application/pdf': '.pdf',
    'text/plain': '.txt',
    // Add more mappings as needed
  };
  
  return mimeTypeToExtension[contentType] || '';
};
