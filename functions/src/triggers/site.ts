import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { SiteInformation } from '../../../models/settings.models';

export const registerHost = functions.database.ref('tanam/{siteId}/domains/{hash}').onCreate(async (snap) => {
    const host = snap.val();
    console.log(`Discovered request to new host: ${host}`);

    const siteInfoDoc = admin.firestore().collection('tanam').doc(process.env.GCLOUD_PROJECT);
    const siteIsSetup = (await siteInfoDoc.get()).exists;
    if (!siteIsSetup) {
        console.log(`Site is not setup yet. Remove this record and retry later when all data is complete.`);
        return snap.ref.remove();
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

export const setupBasicSiteInfo = functions.database.ref('tanam').onCreate(async (snap) => {
    const defaultDomain = `${process.env.GCLOUD_PROJECT}.firebaseapp.com`;
    const siteInfoData: SiteInformation = {
        defaultLanguage: 'en',
        languages: ['en'],
        isCustomDomain: false,
        domains: [defaultDomain],
        primaryDomain: defaultDomain,
        theme: '(default)',
        title: process.env.GCLOUD_PROJECT
    };

    return admin.firestore().collection('tanam').doc(process.env.GCLOUD_PROJECT).set(siteInfoData);
});
