import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as cache from '../utils/cache';
import * as routing from '../utils/routing';

export const tanam_route_create = functions.firestore.document('/{type}/{documentId}').onCreate(async (snap, _) => {
  const document = snap.data();
  if (!document.permalink) {
    console.log('Document is missing attribute "permalink": nothing to do');
    return null;
  }

  const documentRef = snap.ref.toString();
  console.log(`document=${documentRef}, permalink=${document.permalink}`);
  // await admin.database().ref('routes').child(routing.encodeRoutingTablePath(document.permalink)).set(documentRef);

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
  await Promise.all([
    // TODO: Add support for custom URL cache paths
    cache.purgeCache(`${process.env.GCLOUD_PROJECT}.firebaseapp.com`, afterChange.permalink),
    // admin.database().ref('routes').child(routing.encodeRoutingTablePath(beforeChange.permalink)).remove(),
    // admin.database().ref('routes').child(routing.encodeRoutingTablePath(afterChange.permalink)).set(afterDocumentRef)
  ]);

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

  return Promise.all([
    // TODO: Add support for custom URL cache paths
    cache.purgeCache(`${process.env.GCLOUD_PROJECT}.firebaseapp.com`, document.permalink),
    // admin.database().ref('routes').child(routing.encodeRoutingTablePath(document.permalink)).remove()
  ]);
});