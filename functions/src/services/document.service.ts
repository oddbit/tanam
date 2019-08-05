import * as admin from 'firebase-admin';
import { ITanamDocument, TanamSite, TanamDocument } from '../models';
import * as siteInfoService from './site-info.service';
import { TanamHttpRequest } from '../models/http_request.model';

export async function getDocumentById(docId: string): Promise<ITanamDocument> {
  console.log(`[document.service.getDocumentById] ID: ${docId}`);

  const querySnap = await admin.firestore()
    .collectionGroup('documents')
    .where('status', '==', 'published')
    .where('id', '==', docId)
    .limit(1)
    .get();

  console.log(`[document.service.getDocumentById] Number of query results: ${querySnap.docs.length}`);
  return querySnap.empty ? null : querySnap.docs[0].data() as ITanamDocument;
}

export async function getDocumentForRequest(request: TanamHttpRequest): Promise<TanamDocument> {
  console.log(`[document.service.getDocumentByUrl] ${request.toString()}`);
  const siteInfo = await siteInfoService.getSiteInfoFromDomain(request.hostname);
  if (!siteInfo) {
    console.log(`No site found for hostname: ${JSON.stringify(request.hostname)}`);
    return null;
  }

  console.log(`Getting published URL ${request.url} for ${siteInfo.toString()}`);
  const querySnap = await admin.firestore()
    .collection('tanam').doc(siteInfo.id)
    .collection('documents')
    .where('status', '==', 'published')
    .where('url', '==', request.url)
    .limit(1)
    .get();

  if (querySnap.docs.length === 0) {
    console.log(`[document.service.getDocumentByUrl] No document found for: ${request.toString()}`);
    return null;
  }

  return new TanamDocument(querySnap.docs[0].data() as ITanamDocument);
}


/**
 * This method builds up a dependency graph by registering document references
 *
 * A document reference is when one document is embedding another document through
 * partial templates or by using lookup directives to use data from another document
 * inside of the current web template.
 *
 * Once any of those documents are changed, the graph needs to be traversed until
 * all rippling changes have been re-rendered.
 *
 * @param siteInfo The site that this dependency is added for
 * @param docId The ID of the document that is referring to other documents
 * @param references One or more document IDs that are being referred to in a document
 */
export async function addDependency(siteInfo: TanamSite, docId: string, references: string | string[]) {
  console.log(`[addDependency] ${JSON.stringify({ docId, references })}`);
  return admin.firestore()
    .collection('tanam').doc(siteInfo.id)
    .collection('documents').doc(docId)
    .update({ dependencies: admin.firestore.FieldValue.arrayUnion(...references), } as ITanamDocument);
}
