import * as admin from 'firebase-admin';
import { DocumentType } from '../../../models';

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
                type: 'author',
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
                type: 'map',
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

    console.log(`[createDefaultDocuments] ${JSON.stringify({ blog, event, page }, null, 2)}`);

    return Promise.all([
        documentsCollection.doc(blog.id).set(blog),
        documentsCollection.doc(event.id).set(event),
        documentsCollection.doc(page.id).set(page),
    ]);
}
