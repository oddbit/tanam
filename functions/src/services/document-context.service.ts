import * as admin from 'firebase-admin';
import { Document, DocumentContext, PageContext, SiteContext, SiteInformation } from '../models';
import * as documentService from '../services/document.service';

export interface DocumentQueryOptions {
    limit?: number;
    orderBy?: {
        field: string,
        sortOrder: 'asc' | 'desc',
    };
}

const siteCollection = () => admin.firestore().collection('tanam').doc(process.env.GCLOUD_PROJECT);

export async function queryDocumentContext(documentTypeId: string, queryOpts: DocumentQueryOptions = {}) {
    console.log(`[queryDocumentContext] ${documentTypeId}, query=${JSON.stringify(queryOpts)}`);
    const orderByField = queryOpts.orderBy && queryOpts.orderBy.field || 'updated';
    const sortOrder = queryOpts.orderBy && queryOpts.orderBy.sortOrder || 'desc';
    const limit = queryOpts.limit || 20;

    console.log(`[queryDocumentContext] effective query ${JSON.stringify({ orderByField, sortOrder, limit })}`);
    const querySnap = await siteCollection()
        .collection('documents')
        .where('status', '==', 'published')
        .where('documentType', '==', documentTypeId)
        // .orderBy(orderByField, sortOrder) // https://github.com/oddbit/tanam/issues/119
        .limit(limit)
        .get();

    console.log(`[queryDocumentContext] num results: ${querySnap.docs.length}`);

    const result = [];
    for (const doc of querySnap.docs) {
        console.log(`[queryDocumentContext] ${JSON.stringify(doc.data())}`);
        result.push(_toContext(doc.data() as Document));
    }

    return result;
}

export async function getDocumentContextById(docId: string) {
    console.log(`[getDocumentContextById] ${JSON.stringify(docId)}`);
    const doc = await documentService.getDocumentById(docId);
    return !!doc ? _toContext(doc) : null;
}

export async function getDocumentContextByUrl(url: string): Promise<PageContext> {
    console.log(`[getDocumentContextByUrl] ${JSON.stringify(url)}`);
    const documents = await documentService.getDocumentByUrl(url || '/');
    console.log(`[getDocumentContextByUrl] Number of query results: ${documents.length}`);
    return documents.length === 0 ? null : _toContext(documents[0]);
}

async function _toContext(document: Document) {
    if (!document) {
        return null;
    }
    const siteInfo = (await siteCollection().get()).data() as SiteInformation;
    const siteContext: SiteContext = {
        domain: siteInfo.primaryDomain,
        url: `https://${siteInfo.primaryDomain}`,
        theme: siteInfo.theme,
        title: siteInfo.title,
    };

    const documentContext: DocumentContext = {
        id: document.id,
        documentType: document.documentType,
        data: _normalizeData(document.data),
        title: document.title,
        url: document.standalone ? `/${document.url}` : null,
        permalink: document.standalone ? `${siteContext.url}${document.url}` : null,
        revision: document.revision,
        status: document.status,
        tags: document.tags,
        created: (document.created as admin.firestore.Timestamp).toDate(),
        updated: (document.updated as admin.firestore.Timestamp).toDate(),
        published: !!document.published
            ? (document.published as admin.firestore.Timestamp).toDate()
            : null,
    } as DocumentContext;

    return {
        document: documentContext,
        site: siteContext,
    } as PageContext;
}

function _normalizeData(data: any) {
    for (const key in data) {
        const val = data[key];
        if (val && val.toDate) {
            // Applies to Firestore timestamps
            data[key] = val.toDate();
        }
    }

    return data;
}
