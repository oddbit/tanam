import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as cache from '../utils/cache';

export const tanam_cache_update = functions.firestore.document('/{type}/{documentId}').onUpdate((snap, context) => {
    const document = snap.before.data();
    if (!document.permalink) {
        console.log('Deleted a document without a permalink. Nothing to do.');
        return null;
    }

    // TODO: Add support for custom URL cache paths
    return cache.purgeCache(`${process.env.GCLOUD_PROJECT}.firebaseapp.com`, document.permalink);
});

export const tanam_cache_delete = functions.firestore.document('/{type}/{documentId}').onDelete((snap, context) => {
    const document = snap.data();
    if (!document.permalink) {
        console.log('Deleted a document without a permalink. Nothing to do.');
        return null;
    }

    // TODO: Add support for custom URL cache paths
    return cache.purgeCache(`${process.env.GCLOUD_PROJECT}.firebaseapp.com`, document.permalink);
});
