import { QuerySnapshot } from '@google-cloud/firestore';
import * as admin from 'firebase-admin';
import { Document, DocumentContext, PageContext, SiteContext, SiteInformation } from '../models';
import * as documentService from './document.service';
import * as systemNotificationService from './system-message.service';
export interface DocumentQueryOptions {
    limit?: number;
    orderBy?: {
        field: string,
        sortOrder: 'asc' | 'desc',
    };
}

const siteCollection = () => admin.firestore().collection('tanam').doc(process.env.GCLOUD_PROJECT);

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

export async function queryPageContext(documentTypeId: string, queryOpts: DocumentQueryOptions = {}) {
    console.log(`[queryPageContext] ${documentTypeId}, query=${JSON.stringify(queryOpts)}`);
    const orderByField = queryOpts.orderBy && queryOpts.orderBy.field || 'updated';
    const sortOrder = queryOpts.orderBy && queryOpts.orderBy.sortOrder || 'desc';
    const limit = queryOpts.limit || 20;

    console.log(`[queryPageContext] effective query ${JSON.stringify({ orderByField, sortOrder, limit })}`);
    let querySnap: QuerySnapshot;
    try {
        querySnap = await siteCollection()
            .collection('documents')
            .where('status', '==', 'published')
            .where('documentType', '==', documentTypeId)
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
        result.push(_toContext(doc.data() as Document));
    }

    return result;
}

export async function getPageContextById(docId: string) {
    console.log(`[getPageContextById] ${JSON.stringify(docId)}`);
    const doc = await documentService.getDocumentById(docId);
    return !!doc ? _toContext(doc) : null;
}

export async function getPageContextByUrl(url: string): Promise<PageContext> {
    console.log(`[getPageContextByUrl] ${JSON.stringify(url)}`);
    const documents = await documentService.getDocumentByUrl(url || '/');
    console.log(`[getPageContextByUrl] Number of query results: ${documents.length}`);
    return documents.length === 0 ? null : _toContext(documents[0]);
}

async function _toContext(document: Document) {
    if (!document) {
        return null;
    }

    // Run update operation in parallel while doing preparing the context data
    const updatePromise = siteCollection()
        .collection('documents').doc(document.id)
        .update({
            dependencies: [],
            rendered: admin.firestore.FieldValue.serverTimestamp(),
        } as Document);

    const siteInfo = (await siteCollection().get()).data() as SiteInformation;
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
