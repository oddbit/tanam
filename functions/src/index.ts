import admin from "firebase-admin";

const app = admin.initializeApp();
app.firestore().settings({ignoreUndefinedProperties: true});

export * from "./document-publish";
export * from "./triggers/users";
