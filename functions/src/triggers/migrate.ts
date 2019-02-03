import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

export const migrateEntries = functions.firestore.document('tanam-entries/{docId}').onDelete((snap, context) => {
    const docId = context.params.docId;
    const data = snap.data();
    data.documentType = data.contentType;
    return admin.firestore()
        .collection('tanam').doc(process.env.GCLOUD_PROJECT)
        .collection('documents').doc(docId)
        .set(data);
});

export const migrateEntryRevisions = functions.firestore.document('tanam-entries/{docId}/revisions/{revId}').onDelete((snap, context) => {
    const docId = context.params.docId;
    const revId = context.params.revId;
    const data = snap.data();
    data.documentType = data.contentType;
    return admin.firestore()
        .collection('tanam').doc(process.env.GCLOUD_PROJECT)
        .collection('documents').doc(docId)
        .collection('revisions').doc(revId)
        .set(data);
});

export const migrateFiles = functions.firestore.document('tanam-files/{docId}').onDelete((snap, context) => {
    const docId = context.params.docId;
    return admin.firestore()
        .collection('tanam').doc(process.env.GCLOUD_PROJECT)
        .collection('files').doc(docId)
        .set(snap.data());
});

export const migrateThemes = functions.firestore.document('tanam-themes/{docId}').onDelete((snap, context) => {
    const docId = context.params.docId;
    return admin.firestore()
        .collection('tanam').doc(process.env.GCLOUD_PROJECT)
        .collection('themes').doc(docId)
        .set(snap.data());
});

export const migrateTemplates = functions.firestore.document('tanam-templates/{docId}').onDelete((snap, context) => {
    const docId = context.params.docId;
    const theme = snap.data().theme;
    return admin.firestore()
        .collection('tanam').doc(process.env.GCLOUD_PROJECT)
        .collection('themes').doc(theme)
        .collection('templates').doc(docId)
        .set(snap.data());
});


export const migrateTypes = functions.firestore.document('tanam-types/{docId}').onDelete((snap, context) => {
    const docId = context.params.docId;
    return admin.firestore()
        .collection('tanam').doc(process.env.GCLOUD_PROJECT)
        .collection('document-types').doc(docId)
        .set(snap.data());
});


export const migrateUsers = functions.firestore.document('tanam-users/{docId}').onDelete((snap, context) => {
    const docId = context.params.docId;
    return admin.firestore()
        .collection('tanam').doc(process.env.GCLOUD_PROJECT)
        .collection('users').doc(docId)
        .set(snap.data());
});
