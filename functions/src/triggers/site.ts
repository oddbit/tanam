import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { SiteDomainSettings } from '../../../models/settings.models';

export const registerHost = functions.database.ref('tanam/known_hosts/{hash}').onCreate(async (snap) => {
    const host = snap.val();
    console.log(`Discovered request to new host: ${host}`);

    const settingsDoc = admin.firestore().collection('tanam-settings').doc('domain');
    const siteIsSetup = (await settingsDoc.get()).exists;
    if (!siteIsSetup) {
        console.log(`Site is not setup yet. Remove this record and retry later when all data is complete.`);
        return snap.ref.remove();
    }

    return admin.firestore().runTransaction(async (trx) => {
        const trxDoc = await trx.get(settingsDoc);
        const trxSettings = trxDoc.data() as SiteDomainSettings;
        trxSettings.domains = trxSettings.domains || [];
        if (trxSettings.domains.indexOf(host) === -1) {
            console.log(`Discovered adding '${host}' to domain configuration`);
            trxSettings.domains.push(host);
            trx.update(settingsDoc, trxSettings);
        }
    });
});
