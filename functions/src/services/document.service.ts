import * as admin from 'firebase-admin';
import { Document } from '../models';

const siteCollection = () => admin.firestore().collection('tanam').doc(process.env.GCLOUD_PROJECT);
const siteRef = () => admin.database().ref('tanam').child(process.env.GCLOUD_PROJECT);
const normalizeUrl = (url: string) => `/${url}`.replace(/\/+/g, '/');

export async function getDocumentById(docId: string): Promise<Document> {
    console.log(`[document.service.getDocumentById] ID: ${docId}`);
    const querySnap = await siteCollection()
        .collection('documents')
        .where('status', '==', 'published')
        .where('id', '==', docId)
        .limit(1)
        .get();

    console.log(`[document.service.getDocumentById] Number of query results: ${querySnap.docs.length}`);
    return querySnap.empty ? null : querySnap.docs[0].data() as Document;
}

export async function getDocumentByUrl(url: string): Promise<Document[]> {
    console.log(`[document.service.getDocumentByUrl] URL: ${url}`);
    const querySnap = await siteCollection()
        .collection('documents')
        .where('status', '==', 'published')
        .where('url', '==', normalizeUrl(url))
        .limit(1)
        .get();

    console.log(`[document.service.getDocumentByUrl] Number of query results: ${querySnap.docs.length}`);
    const results = [];
    for (const doc of querySnap.docs) {
        results.push(doc.data() as Document);
    }
    return results;
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
 * @param docId The ID of the document that is referring to other documents
 * @param references One or more document IDs that are being referred to in a document
 */
export async function addDependency(docId: string, references: string | string[]) {
    console.log(`[addDependency] ${JSON.stringify({ docId, references })}`);
    return siteCollection().collection('documents').doc(docId).update({
        dependencies: admin.firestore.FieldValue.arrayUnion(references),
    } as Document);
}
