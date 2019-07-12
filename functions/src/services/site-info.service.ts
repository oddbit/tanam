import * as admin from 'firebase-admin';
import { ISiteInformation, SiteInformation } from '../models';
import { createDefaultDocuments } from './document-type.service';
import { createDefaultTemplates } from './template.service';
import { createDefaultTheme } from './theme.service';

export async function getSiteInfo(id: string): Promise<SiteInformation> {
  console.log(`[getSiteInfo] ${JSON.stringify({ id })}`);
  const doc = await admin.firestore().collection('tanam').doc(id).get();
  if (!doc.exists) {
    return null;
  }

  return new SiteInformation(doc.data() as ISiteInformation);
}

export async function getSiteInfoFromDocumentId(documentId: string): Promise<SiteInformation> {
  console.log(`[getSiteInfoFromDocumentId] ${JSON.stringify({ documentId })}`);
  const documentResult = await admin.firestore()
    .collectionGroup('document')
    .where('id', '==', documentId)
    .limit(1)
    .get();

  if (documentResult.docs.length === 0) {
    console.warn(`[getSiteInfoFromDocumentId] No document found with the id: ${documentId}`);
    return null;
  }
  const doc = documentResult.docs[0];
  const siteId = doc.ref.parent.parent.id;
  console.log(`[getSiteInfoFromDocumentId] ${JSON.stringify({ siteId })}`);
  const siteInfoDoc = await doc.ref.parent.parent.get();
  return new SiteInformation(siteInfoDoc.data() as ISiteInformation);
}

export async function getSiteInfoFromDomain(domain: string): Promise<SiteInformation> {
  console.log(`[getSiteInfoFromDomain] ${JSON.stringify({ domain })}`);
  const siteInfoResult = await admin.firestore()
    .collection('tanam')
    .where('domains', 'array-contains', domain)
    .limit(1)
    .get();

  if (siteInfoResult.docs.length === 0) {
    console.warn(`[getSiteInfoFromDomain] No site found for the domain: ${domain}`);
    return null;
  }
  const doc = siteInfoResult.docs[0];
  console.log(`[getSiteInfoFromDomain] ${JSON.stringify({ domain, site: doc.id })}`);
  return new SiteInformation(doc.data() as ISiteInformation);
}

export async function createDefaultSiteInfo() {
  const siteId = process.env.GCLOUD_PROJECT;
  const defaultDomains = [`${process.env.GCLOUD_PROJECT}.firebaseapp.com`, `${process.env.GCLOUD_PROJECT}.web.app`];
  console.log(`[createDefaultSiteInfo] ${defaultDomains}`);

  const siteInfoData: ISiteInformation = {
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
