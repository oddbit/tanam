import { QuerySnapshot } from '@google-cloud/firestore';
import * as admin from 'firebase-admin';
import { ITanamDocument, DocumentContext, PageContext, SiteContext, TanamSite, TanamDocument } from '../models';
import { TanamHttpRequest } from '../models/http_request.model';
import * as documentService from './document.service';
import * as siteInfoService from './site-info.service';
import * as systemNotificationService from './system-message.service';
export interface DocumentQueryOptions {
  limit?: number;
  orderBy?: {
    field: string,
    sortOrder: 'asc' | 'desc',
  };
}

function _normalizeData(data: any) {
  const normalizedData = { ...data };
  for (const key in normalizedData) {
    const val = normalizedData[key];
    if (val && val.toDate) {
      // Applies to Firestore timestamps
      normalizedData[key] = val.toDate();
    } else if (val === undefined) {
      normalizedData[key] = null;
    }
  }

  return normalizedData;
}

export async function queryPageContext(domain: string, documentType: string, queryOpts: DocumentQueryOptions = {}) {
  console.log(`[queryPageContext] ${JSON.stringify({ documentType, queryOpts })}`);
  const orderByField = queryOpts.orderBy && queryOpts.orderBy.field || 'updated';
  const sortOrder = queryOpts.orderBy && queryOpts.orderBy.sortOrder || 'desc';
  const limit = queryOpts.limit || 20;

  console.log(`[queryPageContext] effective query ${JSON.stringify({ orderByField, sortOrder, limit })}`);
  const siteInfo = await siteInfoService.getSiteInfoFromDomain(domain);
  let querySnap: QuerySnapshot;
  try {
    querySnap = await admin.firestore()
      .collection('tanam').doc(siteInfo.id)
      .collection('documents')
      .where('status', '==', 'published')
      .where('documentType', '==', documentType)
      .orderBy(orderByField, sortOrder)
      .limit(limit)
      .get();

  } catch (err) {
    console.error(`[queryPageContext] ${JSON.stringify(err)}`);
    const details = err.details;
    if (details.indexOf('firestore/indexes?create')) {
      await systemNotificationService.reportMissingIndex(details);
    } else {
      await systemNotificationService.reportUnknownError(details);
    }

    return [];
  }

  console.log(`[queryPageContext] num results: ${querySnap.docs.length}`);

  const result = [];
  for (const doc of querySnap.docs) {
    console.log(`[queryPageContext] ${JSON.stringify(doc.data())}`);
    result.push(await _toContext(siteInfo, doc.data() as ITanamDocument));
  }
  console.log(`[queryPageContextResult] ${JSON.stringify(result)}`)

  return result;
}

export async function getPageContextById(docId: string) {
  console.log(`[getPageContextById] ${JSON.stringify(docId)}`);
  const doc = await documentService.getDocumentById(docId);
  const siteInfo = await siteInfoService.getSiteInfoFromDocumentId(docId);
  return !!doc ? _toContext(siteInfo, doc) : null;
}

export async function getPageContextForRequest(request: TanamHttpRequest): Promise<PageContext> {
  console.log(`[getPageContextByUrl] ${request.toString()}`);
  const document = await documentService.getDocumentForRequest(request);
  if (!document) {
    return null;
  }

  const siteInfo = await siteInfoService.getSiteInfoFromDomain(request.hostname);
  return _toContext(siteInfo, document);
}

async function _toContext(siteInfo: TanamSite, document: ITanamDocument) {
  if (!document) {
    return null;
  }

  // Run update operation in parallel while doing preparing the context data
  const updatePromise = admin.firestore()
    .collection('tanam').doc(siteInfo.id)
    .collection('documents').doc(document.id)
    .update({
      dependencies: [],
      rendered: admin.firestore.FieldValue.serverTimestamp(),
    } as ITanamDocument);

  const siteContext: SiteContext = {
    domain: siteInfo.primaryDomain,
    analytics: siteInfo.analytics,
    url: `https://${siteInfo.primaryDomain}`,
    theme: siteInfo.theme,
    title: siteInfo.title,
  };

  const normalizedDoc = _normalizeData(document);
  const documentContext: DocumentContext = {
    id: normalizedDoc.id,
    documentType: normalizedDoc.documentType,
    data: _normalizeData(normalizedDoc.data),
    title: normalizedDoc.title,
    standalone: normalizedDoc.standalone,
    url: normalizedDoc.standalone ? normalizedDoc.url : null,
    permalink: normalizedDoc.standalone ? `${siteContext.url}${normalizedDoc.url}` : null,
    canonicalUrl: normalizedDoc.canonicalUrl,
    revision: normalizedDoc.revision,
    status: normalizedDoc.status,
    tags: normalizedDoc.tags,
    created: normalizedDoc.created,
    updated: normalizedDoc.updated,
    published: normalizedDoc.published,
  } as DocumentContext;

  // Wait until update operation finish
  await updatePromise;

  return {
    document: documentContext,
    site: siteContext,
  } as PageContext;
}
