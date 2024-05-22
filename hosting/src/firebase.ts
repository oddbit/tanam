import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDGYwmKdPdUXkO6abAaLf6BHL8vqqvzdvQ",
  authDomain: "tanam-testing.firebaseapp.com",
  databaseURL: "https://tanam-testing.firebaseio.com",
  projectId: "tanam-testing",
  storageBucket: "tanam-testing.appspot.com",
  messagingSenderId: "33159958289",
  appId: "1:33159958289:web:1056a48a098332d8fd46b0",
};

export const firebaseApp = initializeApp(firebaseConfig);
export const firestore = getFirestore(firebaseApp);
