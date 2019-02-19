import * as admin from 'firebase-admin';
import { SiteInformation, Document, DocumentContext } from '../../../models';

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

    const siteInfo = (await siteCollection().get()).data() as SiteInformation;
    const querySnap = await siteCollection()
        .collection('documents')
        .where('status', '==', 'published')
        .where('documentType', '==', documentTypeId)
        .orderBy(orderByField, sortOrder)
        .limit(limit)
        .get();

    return querySnap.docs.map(doc => _toContext(siteInfo, doc.data() as Document))
}

export async function getDocumentContextById(docId: string) {
    const querySnap = await siteCollection()
        .collection('documents')
        .where('status', '==', 'published')
        .where('id', '==', docId)
        .limit(1)
        .get();

    if (querySnap.empty) {
        return null;
    }

    const siteInfo = (await siteCollection().get()).data() as SiteInformation;
    return _toContext(siteInfo, querySnap.docs[0].data() as Document);
}

export async function getDocumentContextByUrl(url: string) {
    const querySnap = await siteCollection()
        .collection('documents')
        .where('status', '==', 'published')
        .where('url.path', '==', url)
        .limit(1)
        .get();

    if (querySnap.empty) {
        return null;
    }

    const siteInfo = (await siteCollection().get()).data() as SiteInformation;
    return _toContext(siteInfo, querySnap.docs[0].data() as Document);
}

function _toContext(siteInfo: SiteInformation, document: Document) {
    if (!document) {
        return null;
    }

    const context = {
        id: document.id,
        documentType: document.documentType,
        data: document.data,
        title: document.title,
        url: null,
        hostDomain: siteInfo.primaryDomain,
        hostUrl: `https://${siteInfo.primaryDomain}`,
        permalink: null,
        revision: document.revision,
        status: document.status,
        tags: document.tags,
        created: (document.created as admin.firestore.Timestamp).toDate(),
        updated: (document.updated as admin.firestore.Timestamp).toDate(),
        published: !!document.published
            ? (document.published as admin.firestore.Timestamp).toDate()
            : null,
    } as DocumentContext;

    if (document.standalone) {
        context.url = `/${document.url}`;
        context.permalink = `${context.hostUrl}${context.url}`;
    }

    return context;
}
