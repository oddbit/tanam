import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

export const deleteTemplates = functions.firestore.document('tanam/{siteId}/themes/{themeId}').onDelete(async (snap) => {
    console.log(`Deleting all templates for theme ${snap.data().title} (${snap.data().id})`);
    const templates = await snap.ref.collection('templates').get();

    const promises = [];
    const batchDeletes = [];

    for (let i = 0; i < templates.docs.length; i++) {
        const doc = templates.docs[i];
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
