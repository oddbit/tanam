import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { SiteDomainSettings } from '../../../models/settings';
import { ContentEntry } from '../../../models/content-entry';
import { CacheTask } from '../../../models/cache';

export const buildEntryCache = functions.firestore.document('tanam-entries/{documentId}').onWrite(async (change) => {
    const entryBefore = change.before.data() as ContentEntry;
    const entryAfter = change.after.data() as ContentEntry;

    const settingsDoc = await admin.firestore().collection('tanam-settings').doc('domain').get();
    const domainSettings = settingsDoc.data() as SiteDomainSettings;

    const tasks = [];
    for (const domain of domainSettings.domains) {
        if (change.before.exists) {
            tasks.push({
                action: 'update',
                domain: domain,
                url: `${entryBefore.url.root}/${entryBefore.url.path}`,
            } as CacheTask);
        }

        if (change.after.exists) {
            tasks.push({
                action: 'update',
                domain: domain,
                url: `${entryAfter.url.root}/${entryAfter.url.path}`,
            } as CacheTask);
        }
    }

    return Promise.all(
        tasks.map(task => admin.database().ref('tanam/tasks/cache').push(task))
    );
});

export const countEntryStatus = functions.firestore.document('tanam-entries/{documentId}').onWrite((change) => {
    const entryBefore = change.before.data() as ContentEntry;
    const entryAfter = change.after.data() as ContentEntry;

    if (change.before.exists && change.after.exists && entryAfter.status === entryBefore.status) {
        console.log(`Document status unchanged. No counters updated.`);
        return null;
    }

    const contentTypeRef = admin.firestore().collection('tanam-types').doc(entryBefore.contentType);

    return admin.firestore().runTransaction(async (trx) => {
        const trxDoc = await trx.get(contentTypeRef);
        const trxContentType = trxDoc.data();

        console.log(`Num ${entryBefore.contentType} entries before: ${JSON.stringify(trxContentType.numEntries)}`);
        if (change.before.exists) {
            trxContentType.numEntries[entryBefore.status] -= 1;
        }

        if (change.after.exists) {
            trxContentType.numEntries[entryAfter.status] += 1;
        }

        console.log(`Num ${entryBefore.contentType} entries after: ${JSON.stringify(trxContentType.numEntries)}`);
        trx.set(contentTypeRef, trxContentType);
    });
});

export const saveRevision = functions.firestore.document('tanam-entries/{documentId}').onUpdate((change) => {
    const entryBefore = change.before.data() as ContentEntry;
    console.log(`Saving revision ${entryBefore.revision} of ${change.before.ref.path}`);
    return change.before.ref.collection('revisions').doc(`${entryBefore.id}+${entryBefore.revision}`).set(entryBefore);
});

export const deleteRevisions = functions.firestore.document('tanam-entries/{documentId}').onDelete(async (snap) => {
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
