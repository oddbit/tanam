import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { CacheTask, Document, DocumentField, DocumentType, SiteInformation, DocumentStatus } from '../models';

export const onChangeRequestRendering = functions.firestore.document('tanam/{siteId}/documents/{documentId}').onWrite(async (change, context) => {
    const siteId = context.params.siteId;
    const entryBefore = change.before.data() || {} as Document;
    const entryAfter = change.after.data() || {} as Document;

    if (!entryBefore.standalone && !entryAfter.standalone) {
        console.log(`The document is not standalone and is not managed by cache. Do nothing.`);
        return null;
    }

    if (['data', 'title', 'url', 'tags', 'standalone', 'status', 'published'].every(key =>
        JSON.stringify(entryBefore[key]) === JSON.stringify(entryAfter[key])
    )) {
        console.log(`Document changes doesn't require it to be re-rendered.`);
        return null;
    }

    const siteInfoDoc = await admin.firestore().collection('tanam').doc(siteId).get();
    const siteInfo = siteInfoDoc.data() as SiteInformation;

    const tasks = [];
    for (const domain of siteInfo.domains) {
        if (change.before.exists) {
            console.log(`Request cache update entryBefore.url=${entryBefore.url}`);
            tasks.push({
                action: 'update',
                domain: domain,
                url: entryBefore.url,
            } as CacheTask);
        }

        if (change.after.exists) {
            console.log(`Request cache update entryAfter.url=${entryAfter.url}`);
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

export const updateDocumentStatusCounter = functions.firestore.document('tanam/{siteId}/documents/{documentId}').onWrite((change, context) => {
    const siteId = context.params.siteId;
    const entryBefore = change.before.data() as Document;
    const entryAfter = change.after.data() as Document;

    if (change.before.exists && change.after.exists && entryAfter.status === entryBefore.status) {
        console.log(`Document status unchanged. No counters updated.`);
        return null;
    }

    const documentType = entryAfter.documentType || entryBefore.documentType;

    console.log(`Updating counters for ${documentType}`);
    const updates = {};
    if (change.before.exists) {
        updates[`documentCount.${entryBefore.status}`] = admin.firestore.FieldValue.increment(-1);
    }
    if (change.after.exists) {
        updates[`documentCount.${entryAfter.status}`] = admin.firestore.FieldValue.increment(1);
    }

    return admin.firestore()
        .collection('tanam').doc(siteId)
        .collection('document-types').doc(documentType)
        .update(updates);
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

export const deleteFieldReferences = functions.firestore.document('tanam/{siteId}/{contentType}/{fileId}').onDelete(async (snap, context) => {
    const siteId = context.params.siteId;
    const contentType = context.params.contentType;
    if (!['documents', 'files'].some(c => c === contentType)) {
        console.log(`Deleted a ${contentType} document. Nothing to do for this function.`);
        return null;
    }

    const promises = [];
    const deletedDoc = snap.data();

    console.log(`Looking through all document types to find reference fields.`);
    const documentTypeDocs = await admin.firestore()
        .collection('tanam').doc(siteId)
        .collection('document-types')
        .get();

    for (const documentTypeDoc of documentTypeDocs.docs) {
        const documentType = documentTypeDoc.data() as DocumentType;
        const fieldNames = documentType.fields
            .filter((field: DocumentField) => field.type === 'image' || field.type === 'document-reference')
            .map(field => field.key);

        console.log(`Document type "${documentType.id}" has ${fieldNames.length} file references`);
        for (const fieldName of fieldNames) {
            console.log(`Searching and replacing all "${documentType.id}" documents with reference: ${fieldName}`);
            const referringDocumentsQuery = await admin.firestore()
                .collection('tanam').doc(siteId)
                .collection('documents')
                .where(`data.${fieldName}`, '==', deletedDoc.id)
                .get();

            console.log(`Found ${referringDocumentsQuery.docs.length} documents that matched: data.${fieldName} == ${deletedDoc.id}`);

            // TODO: batchwrite for better performance and manage > 500 references
            for (const doc of referringDocumentsQuery.docs) {
                console.log(`Clearing reference "${fieldName}" in document data for id: ${doc.id}`);
                promises.push(admin.firestore().runTransaction(async (trx) => {
                    const trxDoc = await trx.get(doc.ref);
                    return trx.update(doc.ref, {
                        revision: trxDoc.data().revision + 1,
                        [`data.${fieldName}`]: null
                    });
                }));
            }
        }
    }

    return promises;
});

export const publishScheduledDocuments = functions.pubsub.schedule('every 5 minutes').onRun(async (context) => {
    const unpublishedDocuments = await admin.firestore()
        .collection('tanam').doc(process.env.GCLOUD_PROJECT)
        .collection('documents')
        .where('status', '==', 'scheduled' as DocumentStatus)
        .where('published', '<', admin.firestore.Timestamp.fromDate(new Date()))
        .get();

    console.log(`Found ${unpublishedDocuments.docs.length} that are due for publishing`);

    const promises = [];
    for (const doc of unpublishedDocuments.docs) {
        promises.push(doc.ref.update({ status: 'published' as DocumentStatus } as Document));
    }

    return Promise.all(promises);
});
