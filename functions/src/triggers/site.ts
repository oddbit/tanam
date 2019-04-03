import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { SiteInformation } from '../models/settings.models';
import { initializeSite } from '../services/site-info.service';

export const registerHost = functions.database.ref('tanam/{siteId}/domains/{hash}').onCreate(async (snap) => {
    const promises = [];

    const host = snap.val();
    console.log(`[registerHost] Discovered request to new host: ${host}`);

    const siteInfoDoc = admin.firestore().collection('tanam').doc(process.env.GCLOUD_PROJECT);
    promises.push(admin.firestore().runTransaction(async (trx) => {
        const trxDoc = await trx.get(siteInfoDoc);
        const trxSettings = trxDoc.data() as SiteInformation;
        trxSettings.domains = trxSettings.domains || [];
        if (trxSettings.domains.indexOf(host) === -1) {
            console.log(`Discovered adding '${host}' to domain configuration`);
            trxSettings.domains.push(host);
            trx.update(siteInfoDoc, trxSettings);
        }
    }));

    return Promise.all(promises);
});

export const testingSetDefaultData = functions.database.ref('setDefaultData').onCreate(async (snap) => {
    return Promise.all([
        initializeSite(true),
        snap.ref.remove(),
    ]);
});
