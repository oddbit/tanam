import { getApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { useRouter } from "next/router";

export function useFirebase() {
  const firebaseAppName = useRouter().query.__firebaseAppName;
  const appName = Array.isArray(firebaseAppName)
    ? firebaseAppName[0]
    : firebaseAppName;

  const firebaseApp = getApp(appName);

  return {
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp),
    storage: getStorage(firebaseApp),
  };
}