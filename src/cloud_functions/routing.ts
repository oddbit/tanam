import * as functions from 'firebase-functions';
import * as cache from '../utils/cache';

export const tanam_route_create = functions.firestore.document('/{type}/{documentId}').onCreate(async (snap, _) => {
  const document = snap.data();
  if (!document.permalink) {
    console.log('Document is missing attribute "permalink": nothing to do');
    return null;
  }

  const documentRef = snap.ref.toString();
  console.log(`document=${documentRef}, permalink=${document.permalink}`);

  // TODO: Add support for custom URL cache paths
  return cache.heatCache(`${process.env.GCLOUD_PROJECT}.firebaseapp.com`, document.permalink);
});

export const tanam_route_update = functions.firestore.document('/{type}/{documentId}').onUpdate(async (snap, _) => {
  const beforeChange = snap.before.data();
  const afterChange = snap.after.data();
  if (!beforeChange.permalink || !afterChange.permalink) {
    console.log('Document is missing attribute "permalink": nothing to do');
    return null;
  }

  if (beforeChange.permalink === afterChange.permalink) {
    console.log(`No change of permalink for ${snap.after.ref.toString()}`);
    return null;
  }

  const beforeDocumentRef = snap.before.ref.toString();
  console.log(`beforeDocumentRef=${beforeDocumentRef}, beforePermalink=${beforeChange.permalink}`);

  const afterDocumentRef = snap.after.ref.toString();
  console.log(`afterDocumentRef=${afterDocumentRef}, afterPermalink=${afterChange.permalink}`);

  // TODO: Add support for custom URL cache paths
  await cache.purgeCache(`${process.env.GCLOUD_PROJECT}.firebaseapp.com`, afterChange.permalink);
  return cache.heatCache(`${process.env.GCLOUD_PROJECT}.firebaseapp.com`, afterChange.permalink);
});

export const tanam_route_delete = functions.firestore.document('/{type}/{documentId}').onDelete((snap, _) => {
  const document = snap.data();
  if (!document.permalink) {
    console.log('Document is missing attribute "permalink": nothing to do');
    return null;
  }

  const documentRef = snap.ref.toString();
  console.log(`document=${documentRef}, permalink=${document.permalink}`);

  // TODO: Add support for custom URL cache paths
  return cache.purgeCache(`${process.env.GCLOUD_PROJECT}.firebaseapp.com`, document.permalink);
});