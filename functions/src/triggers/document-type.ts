import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { DocumentType } from '../models';


export const cleanUpDocumentsOfType = functions.firestore.document('/tanam/{siteId}/document-types/{type}').onDelete(async (snap, context) => {
  console.log('Deleting documents..')
  const documentType = snap.data() as DocumentType;
  const querySnaps = await admin.firestore()
      .collection('tanam').doc(context.params.siteId)
      .collection('documents').where('documentType', '==', documentType.id)
      .get();

  const promises = [];
  for (const doc of querySnaps.docs) {
      promises.push(doc.ref.delete());
  }

  return Promise.all(promises);
});
