import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { ContentEntry } from '../src/app/services/content-entry.service';
import { ContentType } from '../src/app/services/content-type.service';

export const countEntryStatus = functions.firestore.document('tanam-entries/{documentId}').onWrite((change, context) => {
    const entryBefore = change.before.data() as ContentEntry;
    const entryAfter = change.after.data() as ContentEntry;

    if (change.before.exists && change.after.exists && entryAfter.status === entryBefore.status) {
        console.log(`Document status unchanged. No counters updated.`);
        return null;
    }

    const contentTypeRef = admin.firestore().collection('tanam-types').doc(entryBefore.contentType);

    return admin.firestore().runTransaction(async (trx) => {
        const trxDoc = await trx.get(contentTypeRef);
        const trxContentType = trxDoc.data() as ContentType;

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
