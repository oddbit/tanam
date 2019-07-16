import * as admin from 'firebase-admin';
import { ITanamSite, TanamSite } from '../models';

export async function getSiteInfoFromDocumentId(documentId: string): Promise<TanamSite> {
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
  return new TanamSite(siteInfoDoc.data() as ITanamSite);
}

export async function getSiteInfoFromDomain(domain: string): Promise<TanamSite> {
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
  return new TanamSite(doc.data() as ITanamSite);
}
