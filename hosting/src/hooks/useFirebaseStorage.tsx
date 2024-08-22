import {UserNotification} from "@/models/UserNotification";
import {storage} from "@/plugins/firebase";
import {base64ToBlob} from "@/utils/fileUpload";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {useState} from "react";

interface FirebaseStorageHook {
  isLoading: boolean;
  error: UserNotification | null;
  upload: (folderPath: string, base64: string, contentType: string) => Promise<string | undefined>;
  getFile: (filePath: string) => Promise<string | undefined>;
}

/**
 * Custom hook for interacting with Firebase Storage.
 * Provides functionality for uploading base64 encoded data and retrieving file URLs.
 * @return {FirebaseStorageHook} - Returns an object with states and functions for managing Firebase Storage operations.
 */
export function useFirebaseStorage(): FirebaseStorageHook {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<UserNotification | null>(null);

  /**
   * Uploads a base64 encoded file to Firebase Storage.
   * Converts the base64 string to a Blob object and uploads it to the specified folder path.
   * After uploading, retrieves and returns the download URL of the uploaded file.
   * @param {string} folderPath - The path in Firebase Storage where the file will be saved (e.g., 'images/user_profiles').
   * @param {string} base64 - The base64 encoded file string to be uploaded.
   * @param {string} contentType - The MIME type of the file (e.g., 'image/jpeg', 'application/pdf').
   * @return {Promise<string | undefined>} - A promise that resolves to the download URL of the uploaded file or undefined if the upload fails.
   */
  async function upload(folderPath: string, base64: string, contentType: string): Promise<string | undefined> {
    setIsLoading(true);
    setError(null);

    try {
      // Convert base64 to Blob
      const blob = base64ToBlob(base64, contentType);

      // Create a reference to the file location in Firebase Storage
      const storageRef = ref(storage, folderPath);

      // Upload the Blob to Firebase Storage
      await uploadBytes(storageRef, blob);

      // Retrieve and return the download URL of the uploaded file
      const downloadURL = await getFile(folderPath);
      return downloadURL;
    } catch (err) {
      // Handle errors and set the error state
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(new UserNotification("error", "Problem uploading to storage", `Upload failed: ${errorMessage}`));
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Retrieves the download URL for a file stored in Firebase Storage.
   * @param {string} filePath - The path in Firebase Storage of the file (e.g., 'images/user_profiles/profile.jpg').
   * @return {Promise<string | undefined>} - A promise that resolves to the download URL of the file or undefined if retrieval fails.
   */
  async function getFile(filePath: string): Promise<string | undefined> {
    setIsLoading(true);
    setError(null);

    try {
      // Create a reference to the file location in Firebase Storage
      const storageRef = ref(storage, filePath);

      // Retrieve the download URL for the file
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (err) {
      // Handle errors and set the error state
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(
        new UserNotification(
          "error",
          "Problem getting file from storage",
          `Failed to get download URL: ${errorMessage}`,
        ),
      );
    } finally {
      setIsLoading(false);
    }
  }

  return {isLoading, error, upload, getFile};
}
