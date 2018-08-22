import * as functions from 'firebase-functions';
import * as cache from '../utils/cache';

export const tanam_doc_create_cache = functions.firestore.document('/{type}/{documentId}').onCreate(async (snap, _) => {
  const document = snap.data();
  if (!document.path) {
    console.log('Document is missing attribute "path": nothing to do');
    return null;
  }

  const documentRef = snap.ref.path;
  const permalink = document.path[0];
  console.log(`document=${documentRef}, permalink=${permalink}`);

  // TODO: Add support for custom URL cache paths
  return cache.heatCache(`${process.env.GCLOUD_PROJECT}.firebaseapp.com`, permalink);
});

export const tanam_doc_update_cache = functions.firestore.document('/{type}/{documentId}').onUpdate(async (snap, _) => {
  const beforeChange = snap.before.data();
  const afterChange = snap.after.data();
  if (!beforeChange.path || !afterChange.path) {
    console.log('Document(s) are missing attribute "path": nothing to do');
    return null;
  }

  const beforeDocumentRef = snap.before.ref.path;
  const beforePermalink = beforeChange.path[0];
  console.log(`beforeDocumentRef=${beforeDocumentRef}, beforePermalink=${beforePermalink}`);

  const afterDocumentRef = snap.after.ref.path;
  const afterPermalink = afterChange.path[0];
  console.log(`afterDocumentRef=${afterDocumentRef}, afterPermalink=${afterPermalink}`);

  // TODO: Add support for custom URL cache paths
  await cache.purgeCache(`${process.env.GCLOUD_PROJECT}.firebaseapp.com`, beforePermalink);
  return cache.heatCache(`${process.env.GCLOUD_PROJECT}.firebaseapp.com`, afterPermalink);
});

export const tanam_doc_delete_cache = functions.firestore.document('/{type}/{documentId}').onDelete((snap, _) => {
  const document = snap.data();
  if (!document.path) {
    console.log('Document is missing attribute "path": nothing to do');
    return null;
  }

  const documentRef = snap.ref.path;
  const permalink = document.path[0];
  console.log(`document=${documentRef}, permalink=${permalink}`);

  // TODO: Add support for custom URL cache paths
  return cache.purgeCache(`${process.env.GCLOUD_PROJECT}.firebaseapp.com`, permalink);
});