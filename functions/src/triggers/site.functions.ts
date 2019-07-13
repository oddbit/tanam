import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { DocumentType, ISiteInformation, ITanamUserRole, SiteInformation } from '../models';
import * as models from "../models/cloud-functions.models";

// noinspection JSUnusedGlobalSymbols
export const registerHost = functions.database.ref('tanam/{siteId}/domains/{hash}').onCreate(async (snap) => {
  const promises = [];

  const host = snap.val();
  console.log(`[registerHost] Discovered request to new host: ${host}`);

  const siteInfoDoc = admin.firestore().collection('tanam').doc(process.env.GCLOUD_PROJECT);
  promises.push(admin.firestore().runTransaction(async (trx) => {
    const trxDoc = await trx.get(siteInfoDoc);
    const trxSettings = trxDoc.data() as ISiteInformation;
    trxSettings.domains = trxSettings.domains || [];
    if (trxSettings.domains.indexOf(host) === -1) {
      console.log(`Discovered adding '${host}' to domain configuration`);
      trxSettings.domains.push(host);
      trx.update(siteInfoDoc, trxSettings);
    }
  }));

  return Promise.all(promises);
});

// noinspection JSUnusedGlobalSymbols
export const onNewTanamSite = functions.database.ref('tanam/new/{id}').onCreate(async (snap) => {
  const newSiteData = new models.AdminCreateSiteRequest(snap.val() as models.IAdminCreateSiteRequest);
  const batchWrite = admin.firestore().batch();
  const newSiteBaseRef = admin.firestore().collection('tanam').doc(newSiteData.id);

  const existingSiteDoc = await newSiteBaseRef.get();
  if (existingSiteDoc.exists && !newSiteData.force) {
    console.warn(`There is already a site with id ${newSiteData.id}. Skipping this request.`);
    return snap.ref.child('error').set(`There is already a site with this id (${new Date().toString()}).`);
  }

  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------
  //
  // Create the site
  //

  const tanamSite = new SiteInformation({
    id: newSiteData.id,
    primaryDomain: newSiteData.domain,
    defaultLanguage: newSiteData.language,
    title: newSiteData.name,
  } as ISiteInformation);
  batchWrite.set(newSiteBaseRef, tanamSite.toJson());

  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------
  //
  // Create all document types
  //

  const documentTypes: models.AdminTanamDocumentType[] = [
    new models.AdminTanamDocumentType({
      id: 'page',
      title: 'Page',
      description: 'A regular web page such as front page, or contact page etc.',
      icon: 'chrome_reader_mode',
      slug: '',
      standalone: true,
      documentStatusDefault: 'published',
      fields: [
        {
          title: 'Title',
          key: 'title',
          type: 'input-text',
          isTitle: true,
          validators: ['required'],
        },
        {
          title: 'Page template',
          key: 'template',
          type: 'input-text',
          defaultValue: 'page',
          validators: ['required'],
        },
      ],
    } as DocumentType),

    new models.AdminTanamDocumentType({
      id: 'blog',
      title: 'Blog post',
      slug: 'blog',
      description: 'Blog posts and articles that has a title, leading image and a content body',
      icon: 'local_library',
      standalone: true,
      documentStatusDefault: 'published',
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
    } as DocumentType),


    new models.AdminTanamDocumentType({
      id: 'event',
      title: 'Event',
      description: 'Events and meetups with a location, start and end time',
      icon: 'event',
      slug: 'event',
      standalone: true,
      documentStatusDefault: 'published',
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
    } as DocumentType),


    new models.AdminTanamDocumentType({
      id: 'location',
      title: 'Location',
      description: 'Location data such as venues, addresses or map pointers',
      icon: 'place',
      slug: 'location',
      standalone: false,
      documentStatusDefault: 'published',
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
          validators: ['url'],
        },
      ],
    } as DocumentType),

    new models.AdminTanamDocumentType({
      id: 'author',
      title: 'Author',
      description: 'Author profiles',
      icon: 'person',
      slug: 'profile',
      standalone: false,
      documentStatusDefault: 'published',
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
          validators: ['email'],
        },
        {
          title: 'Profile image URL',
          key: 'photoUrl',
          type: 'input-text',
          validators: ['url'],
        },
        {
          title: 'Profile page URL',
          key: 'website',
          type: 'input-text',
          validators: ['url'],
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
    } as DocumentType),
  ];

  documentTypes.forEach((documentType) => {
    const ref = newSiteBaseRef.collection('document-types').doc(documentType.id);
    batchWrite.set(ref, documentType.toJson());
  });


  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------
  //
  // Create initial user roles
  //

  for (const role in newSiteData.roles) {
    const userRole = new models.AdminTanamUserRole({
      role: role,
      email: newSiteData.roles[role],
    } as ITanamUserRole);

    batchWrite.set(newSiteBaseRef.collection('user-roles').doc(), userRole.toJson());
  }

  return batchWrite.commit();
});
