import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { Document, CacheTask, DocumentType, SiteInformation } from '../../../models';

export const buildEntryCache = functions.firestore.document('tanam/{siteId}/documents/{documentId}').onWrite(async (change) => {
    const entryBefore = change.before.data() as Document;
    const entryAfter = change.after.data() as Document;

    const siteInfoDoc = await admin.firestore().collection('tanam').doc(process.env.GCLOUD_PROJECT).get();
    const siteInfo = siteInfoDoc.data() as SiteInformation;

    const tasks = [];
    for (const domain of siteInfo.domains) {
        if (change.before.exists) {
            tasks.push({
                action: 'update',
                domain: domain,
                url: entryBefore.url,
            } as CacheTask);
        }

        if (change.after.exists) {
            tasks.push({
                action: 'update',
                domain: domain,
                url: entryAfter.url,
            } as CacheTask);
        }
    }

    return Promise.all(
        tasks.map(task => admin.database().ref('tanam/{siteId}/tasks/cache').push(task))
    );
});

export const countEntryStatus = functions.firestore.document('tanam/{siteId}/documents/{documentId}').onWrite((change) => {
    const entryBefore = change.before.data() as Document;
    const entryAfter = change.after.data() as Document;

    if (change.before.exists && change.after.exists && entryAfter.status === entryBefore.status) {
        console.log(`Document status unchanged. No counters updated.`);
        return null;
    }

    const documentType = entryAfter.documentType || entryBefore.documentType;
    const documentTypeRef = admin.firestore().collection('tanam-types').doc(documentType);
    const docsQuery = admin.firestore().collection('tanam-entries').where('documentType', '==', documentType);

    return admin.firestore().runTransaction(async (trx) => {
        const trxDoc = await trx.get(documentTypeRef);
        const trxContentType = trxDoc.data() as DocumentType;

        const promises = []
        promises.push(docsQuery.where('status', '==', 'published').get().then((snap) => {
            trxContentType.numEntries.published = snap.docs.length;
        }));
        promises.push(docsQuery.where('status', '==', 'unpublished').get().then((snap) => {
            trxContentType.numEntries.unpublished = snap.docs.length;
        }));

        await Promise.all(promises);
        trx.set(documentTypeRef, trxContentType);
    });
});

export const saveRevision = functions.firestore.document('tanam/{siteId}/documents/{documentId}').onUpdate((change) => {
    const entryBefore = change.before.data() as Document;
    console.log(`Saving revision ${entryBefore.revision} of ${change.before.ref.path}`);
    return change.before.ref.collection('revisions').doc(`${entryBefore.id}+${entryBefore.revision}`).set(entryBefore);
});

export const deleteRevisions = functions.firestore.document('tanam/{siteId}/documents/{documentId}').onDelete(async (snap) => {
    console.log(`Deleting all revisions of ${snap.ref.path}`);
    const revs = await snap.ref.collection('revisions').get();

    const promises = [];
    const batchDeletes = [];

    for (let i = 0; i < revs.docs.length; i++) {
        const doc = revs.docs[i];
        if ((i % 500) === 0) {
            batchDeletes.push(admin.firestore().batch());
        }

        const batchNum = batchDeletes.length - 1;
        console.log(`Batch delete #${batchNum} (${i + 1}/500): ${doc.id}`);
        batchDeletes[batchNum].delete(doc.ref);
    }

    batchDeletes.forEach((batchWrite) => {
        promises.push(batchWrite.commit());
    });

    return Promise.all(promises);
});

export const updateDocumentReferenceFields = functions.firestore.document('tanam/{siteId}/documents/{documentId}').onWrite(async (change) => {
    if (!change.before) {
        console.log(`Nothing to do for newly created documents`);
        return null;
    }

    const promises = [];
    const documentBefore = change.before.data() as Document;
    const documentAfter = change.after.data() as Document;

    // 1. Check if this document is registered as a field reference
    console.log(`Looking for document types that has content type "document-reference"`);
    const documentTypeDocs = await admin.firestore()
        .collection('tanam').doc(process.env.GCLOUD_PROJECT)
        .collection('document-types')
        .get();

    for (const documentTypeDoc of documentTypeDocs.docs) {
        const documentType = documentTypeDoc.data() as DocumentType;
        const fieldNames = documentType.fields
            .filter(field => field.type === 'document-reference' && field.documentType === documentBefore.documentType)
            .map(field => field.key);

        console.log(`Document type "${documentType.id}" has ${fieldNames.length} document references`);


        for (const fieldName of fieldNames) {
            console.log(`Searching and replacing all "${documentType.id}" documents with document reference: ${fieldName}`);
            const referringDocumentsQuery = await admin.firestore()
                .collection('tanam').doc(process.env.GCLOUD_PROJECT)
                .collection('documents')
                .where(`data.${fieldName}.id`, '==', documentBefore.id)
                .get();

            console.log(`Found ${referringDocumentsQuery.docs.length} documents that matched: data.${fieldName}.id == ${documentBefore.id}`);

            // TODO: batchwrite for better performance and manage > 500 references
            for (const doc of referringDocumentsQuery.docs) {
                console.log(`Updating document reference "${fieldName}" in document data for id: ${doc.id}`);
                const referringDocument = doc.data() as Document;
                console.log(JSON.stringify({ before: referringDocument.data[fieldName], after: documentAfter }));
                referringDocument.data[fieldName] = documentAfter;
                promises.push(doc.ref.set(referringDocument));
            }
        }
    }

    return promises;
});
