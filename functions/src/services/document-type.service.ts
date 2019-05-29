
import * as admin from 'firebase-admin';
import { DocumentType } from '../models';

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
        documentStatusDefault: 'published',
        created: admin.firestore.FieldValue.serverTimestamp(),
        updated: admin.firestore.FieldValue.serverTimestamp(),
        documentCount: {
            published: 0,
            unpublished: 0,
            scheduled: 0,
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
        documentStatusDefault: 'published',
        created: admin.firestore.FieldValue.serverTimestamp(),
        updated: admin.firestore.FieldValue.serverTimestamp(),
        documentCount: {
            published: 0,
            unpublished: 0,
            scheduled: 0,
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
        documentStatusDefault: 'published',
        created: admin.firestore.FieldValue.serverTimestamp(),
        updated: admin.firestore.FieldValue.serverTimestamp(),
        documentCount: {
            published: 0,
            unpublished: 0,
            scheduled: 0,
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
        documentStatusDefault: 'published',
        created: admin.firestore.FieldValue.serverTimestamp(),
        updated: admin.firestore.FieldValue.serverTimestamp(),
        documentCount: {
            published: 0,
            unpublished: 0,
            scheduled: 0,
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
            {
                title: 'Blurb (short description)',
                key: 'blurb',
                type: 'textbox-plain',
                validators: [],
            },
            {
                title: 'About',
                key: 'about',
                type: 'textbox-rich',
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
        documentStatusDefault: 'published',
        created: admin.firestore.FieldValue.serverTimestamp(),
        updated: admin.firestore.FieldValue.serverTimestamp(),
        documentCount: {
            published: 0,
            unpublished: 0,
            scheduled: 0,
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
