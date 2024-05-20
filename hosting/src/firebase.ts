import { getApp } from "firebase/app";
import { useRouter } from "next/router";

const firebaseAppName = useRouter().query.__firebaseAppName;
const appName = Array.isArray(firebaseAppName)
  ? firebaseAppName[0]
  : firebaseAppName;


const firebaseApp = getApp(appName);
export default firebaseApp;