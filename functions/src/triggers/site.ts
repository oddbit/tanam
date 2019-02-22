import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { SiteInformation } from '../../../models/settings.models';
import { createDefaultSiteInfo } from '../services/site-info.service';

export const registerHost = functions.database.ref('tanam/{siteId}/domains/{hash}').onCreate(async (snap) => {
    const host = snap.val();
    console.log(`[registerHost] Discovered request to new host: ${host}`);

    const siteInfoDoc = admin.firestore().collection('tanam').doc(process.env.GCLOUD_PROJECT);
    const siteIsSetup = (await siteInfoDoc.get()).exists;
    if (!siteIsSetup) {
        console.log(`[registerHost] Site is not setup yet.`);
        await createDefaultSiteInfo();
    }

    return admin.firestore().runTransaction(async (trx) => {
        const trxDoc = await trx.get(siteInfoDoc);
        const trxSettings = trxDoc.data() as SiteInformation;
        trxSettings.domains = trxSettings.domains || [];
        if (trxSettings.domains.indexOf(host) === -1) {
            console.log(`Discovered adding '${host}' to domain configuration`);
            trxSettings.domains.push(host);
            trx.update(siteInfoDoc, trxSettings);
        }
    });
});
