import * as admin from 'firebase-admin';
import { DocumentType, Document } from '../models';

const siteCollection = () => admin.firestore().collection('tanam').doc(process.env.GCLOUD_PROJECT);
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

export async function createDefaultDocuments() {
    const documentsCollection = admin.firestore()
        .collection('tanam').doc(process.env.GCLOUD_PROJECT)
        .collection('document-types');

    const blog: DocumentType = {
        id: 'blog',
        title: 'Blog post',
        description: 'Blog posts and articles that has a title, leading image and a content body',
        icon: 'local_library',
        slug: 'blog',
        standalone: true,
        created: admin.firestore.FieldValue.serverTimestamp(),
        updated: admin.firestore.FieldValue.serverTimestamp(),
        numEntries: {
            published: 0,
            unpublished: 0,
        },
        fields: [
            {
                title: 'Title',
                key: 'title',
                type: 'input-text',
                isTitle: true,
                validators: ['required'],
            },
            {
                title: 'Featured image',
                key: 'featuredImage',
                type: 'image',
                validators: [],
            },
            {
                title: 'Author',
                key: 'author',
                type: 'document-reference',
                documentType: 'author',
                validators: [],
            },
            {
                title: 'Content',
                key: 'content',
                type: 'textbox-rich',
                validators: ['required'],
            },
        ],
    };

    const event: DocumentType = {
        id: 'event',
        title: 'Event',
        description: 'Events and meetups with a location, start and end time',
        icon: 'event',
        slug: 'event',
        standalone: true,
        created: admin.firestore.FieldValue.serverTimestamp(),
        updated: admin.firestore.FieldValue.serverTimestamp(),
        numEntries: {
            published: 0,
            unpublished: 0,
        },
        fields: [
            {
                title: 'Title',
                key: 'title',
                type: 'input-text',
                isTitle: true,
                validators: ['required'],
            },
            {
                title: 'Start time',
                key: 'timeStart',
                type: 'date-time',
                validators: ['required'],
            },
            {
                title: 'End time',
                key: 'timeEnd',
                type: 'date-time',
                validators: ['required'],
            },
            {
                title: 'Location',
                key: 'location',
                type: 'document-reference',
                documentType: 'location',
                validators: [],
            },
            {
                title: 'Featured image',
                key: 'featuredImage',
                type: 'image',
                validators: [],
            },
            {
                title: 'Content',
                key: 'content',
                type: 'textbox-rich',
                validators: ['required'],
            },
        ],
    };

    const location: DocumentType = {
        id: 'location',
        title: 'Location',
        description: 'Location data such as venues, addresses or map pointers',
        icon: 'place',
        slug: 'location',
        standalone: false,
        created: admin.firestore.FieldValue.serverTimestamp(),
        updated: admin.firestore.FieldValue.serverTimestamp(),
        numEntries: {
            published: 0,
            unpublished: 0,
        },
        fields: [
            {
                title: 'Title',
                key: 'title',
                type: 'input-text',
                isTitle: true,
                validators: ['required'],
            },
            {
                title: 'Address field 1',
                key: 'address1',
                type: 'input-text',
                validators: [],
            },
            {
                title: 'Address field 2',
                key: 'address2',
                type: 'input-text',
                validators: [],
            },
            {
                title: 'City',
                key: 'city',
                type: 'input-text',
                validators: [],
            },
            {
                title: 'Postal code',
                key: 'postCode',
                type: 'input-text',
                validators: [],
            },
            {
                title: 'Region (state/province)',
                key: 'region',
                type: 'input-text',
                validators: [],
            },
            {
                title: 'Country',
                key: 'country',
                type: 'input-text',
                validators: [],
            },
            {
                title: 'Maps URL',
                key: 'mapsUrl',
                type: 'input-text',
                validators: [],
            },
        ],
    };

    const author: DocumentType = {
        id: 'author',
        title: 'Author',
        description: 'Author profiles',
        icon: 'person',
        slug: 'profile',
        standalone: false,
        created: admin.firestore.FieldValue.serverTimestamp(),
        updated: admin.firestore.FieldValue.serverTimestamp(),
        numEntries: {
            published: 0,
            unpublished: 0,
        },
        fields: [
            {
                title: 'Name',
                key: 'name',
                type: 'input-text',
                isTitle: true,
                validators: ['required'],
            },
            {
                title: 'Email',
                key: 'email',
                type: 'input-text',
                validators: [],
            },
            {
                title: 'Profile image URL',
                key: 'photoUrl',
                type: 'input-text',
                validators: [],
            },
            {
                title: 'Profile page URL',
                key: 'website',
                type: 'input-text',
                validators: [],
            },
        ],
    };

    const page: DocumentType = {
        id: 'page',
        title: 'Page',
        description: 'A regular web page such as front page, or contact page etc.',
        icon: 'chrome_reader_mode',
        slug: '',
        standalone: true,
        created: admin.firestore.FieldValue.serverTimestamp(),
        updated: admin.firestore.FieldValue.serverTimestamp(),
        numEntries: {
            published: 0,
            unpublished: 0,
        },
        fields: [
            {
                title: 'Title',
                key: 'title',
                type: 'input-text',
                isTitle: true,
                validators: ['required'],
            },
            {
                title: 'Page layout',
                key: 'layout',
                type: 'input-text',
                defaultValue: 'default',
                validators: [],
            },
            {
                title: 'Content',
                key: 'content',
                type: 'textbox-rich',
                validators: [],
            },
        ],
    };

    console.log(`[document.service.createDefaultDocuments] ${JSON.stringify({ blog, event, location, author, page }, null, 2)}`);

    return Promise.all([
        documentsCollection.doc(blog.id).set(blog),
        documentsCollection.doc(event.id).set(event),
        documentsCollection.doc(location.id).set(location),
        documentsCollection.doc(author.id).set(author),
        documentsCollection.doc(page.id).set(page),
    ]);
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
    const documentsCollection = siteCollection().collection('documents');
}
