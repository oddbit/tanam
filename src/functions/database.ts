import * as functions from 'firebase-functions';
import * as https from 'https';

const tanam_purgeCache = functions.firestore.document('/{type}/{documentId}').onUpdate((snap, context) => {
    const docData = snap.before.data();
    if (!docData.url) {
        return null;
    }

    console.log(`Purging cache: ${docData.url}`);
    https.request({
        hostname: 'site-domain...', // TODO replace this
        port: 443,
        path: docData.url,
        method: 'PURGE'
    });

    return null;
});
