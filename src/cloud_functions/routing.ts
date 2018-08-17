import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as utils from 'utils/routing';

export const tanam_route_create = functions.firestore.document('/{type}/{documentId}').onCreate((snap, context) => {
    const document = snap.data();
    if (!document.permalink) {
        console.log('Document is missing attribute "permalink": nothing to do');
        return null;
    }

    const documentRef = snap.ref.toString();
    console.log(`document=${documentRef}, permalink=${document.permalink}`);
    return admin.database().ref('routes').child(utils.encodeRoutingTablePath(document.permalink)).set(documentRef);
});

export const tanam_route_update = functions.firestore.document('/{type}/{documentId}').onUpdate((snap, context) => {
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
    return Promise.all([
        admin.database().ref('routes').child(utils.encodeRoutingTablePath(beforeChange.permalink)).remove(),
        admin.database().ref('routes').child(utils.encodeRoutingTablePath(afterChange.permalink)).set(afterDocumentRef)
    ]);
});

export const tanam_route_delete = functions.firestore.document('/{type}/{documentId}').onDelete((snap, context) => {
    const document = snap.data();
    if (!document.permalink) {
        console.log('Document is missing attribute "permalink": nothing to do');
        return null;
    }

    const documentRef = snap.ref.toString();
    console.log(`document=${documentRef}, permalink=${document.permalink}`);
    return admin.database().ref('routes').child(utils.encodeRoutingTablePath(document.permalink)).remove();
});