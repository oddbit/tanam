import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { ITanamDocument, ITanamDocumentField, DocumentStatus } from '../models';
import * as taskService from '../services/task.service';
import * as documentTypeService from '../services/document-type.service';

// noinspection JSUnusedGlobalSymbols
export const onCreateDocumentRequestRendering = functions.firestore.document('tanam/{siteId}/documents/{documentId}').onCreate(async (snap, context) => {
  const siteId = context.params.siteId;
  const document = snap.data() as ITanamDocument;

  if (!document.standalone || document.status !== 'published') {
    console.log(`The document is not published and standalone and is not managed by cache. Do nothing.`);
    return null;
  }

  return taskService.cacheTask('create', siteId, document.url);
});

// noinspection JSUnusedGlobalSymbols
export const onDeleteDocumentCleanUp = functions.firestore.document('tanam/{siteId}/documents/{documentId}').onDelete(async (snap, context) => {
  const siteId = context.params.siteId;
  const documentId = context.params.documentId;
  const document = snap.data() as ITanamDocument;

  const referencingDocs = await admin.firestore()
    .collection('tanam').doc(siteId)
    .collection('documents')
    .where('dependencies', 'array-contains', documentId)
    .get();

  const promises = [taskService.cacheTask('delete', siteId, document.url)];
  for (const doc of referencingDocs.docs) {
    promises.push(taskService.cacheTask('update', siteId, doc.data().url));
  }

  return Promise.all(promises);
});

// noinspection JSUnusedGlobalSymbols
export const onUpdateDocumentRequestRendering = functions.firestore.document('tanam/{siteId}/documents/{documentId}').onUpdate(async (change, context) => {
  const siteId = context.params.siteId;
  const documentId = context.params.documentId;
  const entryBefore = change.before.data() as ITanamDocument;
  const entryAfter = change.after.data() as ITanamDocument;

  if (['data', 'title', 'url', 'tags', 'standalone', 'status', 'published'].every(key =>
    JSON.stringify(entryBefore[key]) === JSON.stringify(entryAfter[key])
  )) {
    console.log(`Document changes doesn't require it to be re-rendered.`);
    return null;
  }

  console.log(JSON.stringify({siteId, documentId, urlBefore: entryBefore.url, urlAfter: entryAfter.url}));
  const referencingDocs = await admin.firestore()
    .collection('tanam').doc(siteId)
    .collection('documents')
    .where('dependencies', 'array-contains', documentId)
    .where('rendered', '<', entryAfter.updated)
    .get();

  const promises = [];
  promises.push(taskService.cacheTask('update', siteId, entryBefore.url));
  promises.push(taskService.cacheTask('update', siteId, entryAfter.url));

  for (const doc of referencingDocs.docs) {
    const referringDocument = doc.data() as ITanamDocument;
    console.log(`Referenced by document id=${referringDocument.id}, url=${referringDocument.url}`);
    promises.push(taskService.cacheTask('update', siteId, referringDocument.url));
  }

  return Promise.all(promises);
});

// noinspection JSUnusedGlobalSymbols
export const updateDocumentStatusCounter = functions.firestore.document('tanam/{siteId}/documents/{documentId}').onWrite((change, context) => {
  const siteId = context.params.siteId;
  const entryBefore = change.before.data() || {} as ITanamDocument;
  const entryAfter = change.after.data() || {} as ITanamDocument;

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

// noinspection JSUnusedGlobalSymbols
export const saveRevision = functions.firestore.document('tanam/{siteId}/documents/{documentId}').onUpdate((change) => {
  const entryBefore = change.before.data() as ITanamDocument;
  console.log(`Saving revision ${entryBefore.revision} of ${change.before.ref.path}`);
  return change.before.ref.collection('revisions').doc(`${entryBefore.id}+${entryBefore.revision}`).set(entryBefore);
});

// noinspection JSUnusedGlobalSymbols
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

// noinspection JSUnusedGlobalSymbols
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
  const documentTypeDocs = await documentTypeService.getDocumentTypes(siteId);

  for (const documentType of documentTypeDocs) {
    const fieldNames = documentType.fields
      .filter((field: ITanamDocumentField) => field.type === 'image' || field.type === 'document-reference')
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

// noinspection JSUnusedGlobalSymbols
export const publishScheduledDocuments = functions.pubsub.schedule('every 5 minutes').onRun(async () => {
  const unpublishedDocuments = await admin.firestore()
    .collection('tanam').doc(process.env.GCLOUD_PROJECT)
    .collection('documents')
    .where('status', '==', 'scheduled' as DocumentStatus)
    .where('published', '<', admin.firestore.Timestamp.fromDate(new Date()))
    .get();

  console.log(`Found ${unpublishedDocuments.docs.length} that are due for publishing`);

  const promises = [];
  for (const doc of unpublishedDocuments.docs) {
    promises.push(doc.ref.update({status: 'published' as DocumentStatus} as ITanamDocument));
  }

  return Promise.all(promises);
});
