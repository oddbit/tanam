import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as https from 'https';
import * as utils from './util';


export const tanam_route_create = functions.firestore.document('/{type}/{documentId}').onCreate((snap, context) => {
    const document = snap.data();
    if (!document.permalink) {
        throw new Error('Missing attribute "permalink"');
    }

    const documentRef = snap.ref.toString();
    console.log(`document=${documentRef}, permalink=${document.permalink}`);
    return admin.database().ref('routes').child(utils.encodePath(document.permalink)).set(documentRef);
});

export const tanam_route_update = functions.firestore.document('/{type}/{documentId}').onUpdate((snap, context) => {
    const beforeChange = snap.before.data();
    const afterChange = snap.after.data();
    if (!beforeChange.permalink || !afterChange.permalink) {
        throw new Error('Missing attribute "permalink"');
    }

    if (beforeChange.permalink === afterChange.permalink) {
        console.log(`No change of permalink for ${snap.after.ref.toString()}`);
        return null;
    }

    const beforeDocumentRef = snap.before.ref.toString();
    console.log(`beforeDocumentRef=${beforeDocumentRef}, beforePermalink=${beforeChange.permalink}`);

    const afterDocumentRef = snap.after.ref.toString();
    console.log(`afterDocumentRef=${afterDocumentRef}, afterPermalink=${afterChange.permalink}`);
    return Promise.all([
        admin.database().ref('routes').child(utils.encodePath(beforeChange.permalink)).remove(),
        admin.database().ref('routes').child(utils.encodePath(afterChange.permalink)).set(afterDocumentRef)
    ]);
});

export const tanam_route_delete = functions.firestore.document('/{type}/{documentId}').onDelete((snap, context) => {
    const document = snap.data();
    if (!document.permalink) {
        throw new Error('Missing attribute "permalink"');
    }

    const documentRef = snap.ref.toString();
    console.log(`document=${documentRef}, permalink=${document.permalink}`);
    return admin.database().ref('routes').child(utils.encodePath(document.permalink)).remove();
});

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
