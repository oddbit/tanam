import * as admin from 'firebase-admin';
import * as express from 'express';

export async function getFirestoreDocument(request: express.Request, response: express.Response) {
  const collections = await admin.firestore().getCollections();
  const documents = [];

  for (const collection of collections) {
    const snap = await collection.where('permalink', '==', request.url).get();
    snap.docs.forEach(doc => {
      documents.push(doc);
    });
  }

  if (documents.length === 0) {
    response.status(404).end();
    throw new Error(`No document found for URL ${request.url}`);
  }

  if (documents.length > 1) {
    response.status(500).send('Database inconsistency. Path maps to more than one document.').end();
    throw new Error('Found more than one document');
  }

  return documents[0];
}