import admin from "firebase-admin";

const app = admin.initializeApp();
app.firestore().settings({ignoreUndefinedProperties: true});

