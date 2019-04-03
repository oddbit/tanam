import * as admin from 'firebase-admin';
import { SiteInformation } from '../models';

export async function getSiteInfo() {
    const siteInfoDoc = await admin.firestore().collection('tanam').doc(process.env.GCLOUD_PROJECT).get();
    return siteInfoDoc.data() as SiteInformation;
}

export async function createDefaultSiteInfo() {
    const defaultDomain = `${process.env.GCLOUD_PROJECT}.firebaseapp.com`;
    console.log(`[createDefaultSiteInfo] ${defaultDomain}`);

    const siteInfoData: SiteInformation = {
        defaultLanguage: 'en',
        languages: ['en'],
        isCustomDomain: false,
        domains: [defaultDomain],
        primaryDomain: defaultDomain,
        theme: 'default',
        title: process.env.GCLOUD_PROJECT
    };

    return admin.firestore().collection('tanam').doc(process.env.GCLOUD_PROJECT).set(siteInfoData);
}
