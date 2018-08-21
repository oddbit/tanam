import * as admin from 'firebase-admin';

export async function getFirestoreDocument(url: string) {
  const collections = await admin.firestore().getCollections();
  const documents = [];

  for (const collection of collections) {
    const snap = await collection.where('path', 'array-contains', url).get();
    snap.docs.forEach(doc => {
      documents.push(doc);
    });
  }

  return documents;
}