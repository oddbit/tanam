import * as admin from 'firebase-admin';
import { SiteInformation } from '../models';
import { createDefaultDocuments } from './document-type.service';
import { createDefaultTemplates } from './template.service';
import { createDefaultTheme } from './theme.service';

export async function getSiteInfo() {
    const siteInfoDoc = await admin.firestore().collection('tanam').doc(process.env.GCLOUD_PROJECT).get();
    return siteInfoDoc.data() as SiteInformation;
}

export async function createDefaultSiteInfo() {
    const siteId = process.env.GCLOUD_PROJECT;
    const defaultDomains = [`${process.env.GCLOUD_PROJECT}.firebaseapp.com`, `${process.env.GCLOUD_PROJECT}.web.app`];
    console.log(`[createDefaultSiteInfo] ${defaultDomains}`);

    const siteInfoData: SiteInformation = {
        id: siteId,
        defaultLanguage: 'en',
        languages: ['en'],
        isCustomDomain: false,
        domains: defaultDomains,
        primaryDomain: defaultDomains[0],
        analytics: '',
        theme: 'default',
        title: process.env.GCLOUD_PROJECT
    };

    return admin.firestore().collection('tanam').doc(siteId).set(siteInfoData);
}

export async function initializeSite(force: boolean = false) {
    const siteInfoDoc = admin.firestore().collection('tanam').doc(process.env.GCLOUD_PROJECT);
    const siteIsSetup = (await siteInfoDoc.get()).exists;
    if (siteIsSetup && !force) {
        return null;
    }

    console.log(`[registerHost] Site is not setup yet.`);
    return Promise.all([
        createDefaultSiteInfo(),
        createDefaultDocuments(),
        createDefaultTheme(),
        createDefaultTemplates(),
    ]);
}
