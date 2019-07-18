import * as admin from 'firebase-admin';
import { TanamSite, ThemeTemplate } from '../models';

export async function getTemplates(siteInfo: TanamSite) {
  console.log(`[getTemplates] Finding templates for theme: ${siteInfo.theme}`);
  const templatesSnap = await admin.firestore()
    .collection('tanam').doc(siteInfo.id)
    .collection('themes').doc(siteInfo.theme)
    .collection('templates')
    .get();

  console.log(`[getTemplates] Number of templates found: ${templatesSnap.docs.length}`);
  return templatesSnap.docs.map(doc => doc.data() as ThemeTemplate);
}

export async function getErrorTemplate(siteInfo: TanamSite, errorTemplate: 'http404' | 'http500' | 'error') {
  console.log(`[document.service.getErrorTemplate] ${JSON.stringify({siteInfo, errorTemplate})}`);
  const doc = await admin.firestore()
    .collection('tanam').doc(siteInfo.id)
    .collection('themes').doc(siteInfo.theme)
    .collection('templates').doc(errorTemplate)
    .get();

  if (!doc.exists) {
    return null;
  }

  return doc.data() as ThemeTemplate;
}

export async function createDefaultTemplates() {
  const templatesCollection = admin.firestore()
    .collection('tanam').doc(process.env.GCLOUD_PROJECT)
    .collection('themes').doc('default')
    .collection('templates');

  const blog: ThemeTemplate = {
    id: 'blog',
    title: 'Blog post template',
    created: admin.firestore.FieldValue.serverTimestamp(),
    updated: admin.firestore.FieldValue.serverTimestamp(),
    selector: 'blog',
    templateType: 'dust',
    template: `
        <!-- {@contextDump /} -->
        <h1>{document.title}</h1>
        <img src="/_/image/{document.data.featuredImage}?s=medium" />
        {@document id=document.data.author document=document}
            {> author document=document /}
        {/document}

        <p>{document.data.content|s}</p>
        `,
  };
  const event: ThemeTemplate = {
    id: 'event',
    title: 'Event template',
    created: admin.firestore.FieldValue.serverTimestamp(),
    updated: admin.firestore.FieldValue.serverTimestamp(),
    selector: 'event',
    templateType: 'dust',
    template: `
        <!-- {@contextDump /} -->
        <h1>{document.title}</h1>
        <img src="/_/image/{document.data.featuredImage}" />
        <div class="event-dates">
            <span>{document.data.timeStart}</span>
            <span>{document.data.timeEnd}</span>
        </div>
        {#document.data.location}
            <p><a href="{mapUrl}">{name}</a></p>
        {/document.data.location}
        <p>{document.data.content|s}</p>
        `,
  };

  const location: ThemeTemplate = {
    id: 'location',
    title: 'Location template',
    created: admin.firestore.FieldValue.serverTimestamp(),
    updated: admin.firestore.FieldValue.serverTimestamp(),
    selector: 'location',
    templateType: 'dust',
    template: `
        <!-- {@contextDump /} -->
        <h2>{document.title}</h2>
        {#document.data}
            <ul>
                <li>{address1}</li>
                <li>{address2}</li>
                <li>{city}</li>
                <li>{region}</li>
                <li>{postCode}</li>
                <li>{country}</li>
                <li><a href="{mapsUrl}">View on maps</a></li>
            </ul>
        {/document.data}
        `,
  };

  const author: ThemeTemplate = {
    id: 'author',
    title: 'Author template',
    created: admin.firestore.FieldValue.serverTimestamp(),
    updated: admin.firestore.FieldValue.serverTimestamp(),
    selector: 'author',
    templateType: 'dust',
    template: `
        <!-- {@contextDump /} -->
        <h1>{document.title}</h1>
        {#document.data}
            <img src="{photoUrl}" />
            <ul>
                <li>{name}</li>
                <li>{email}</li>
                <li><a href="{website}">Profile website</a></li>
            </ul>
        {/document.data}
        `,
  };


  const page: ThemeTemplate = {
    id: 'page',
    title: 'Standard page template',
    created: admin.firestore.FieldValue.serverTimestamp(),
    updated: admin.firestore.FieldValue.serverTimestamp(),
    selector: 'page',
    templateType: 'dust',
    template: `
        <!-- {@contextDump /} -->
        {@select key=document.data.layout}
            {@eq value="landing-page"}Show a landing page layout{/eq}
            {@eq value="right-sidebar"}Include a right sidebar page template{/eq}
            {@none} Display the regular page layout {/none}
        {/select}
        `,
  };

  console.log(`[createDefaultTemplates] ${JSON.stringify({blog, event, location, author, page}, null, 2)}`);

  return Promise.all([
    templatesCollection.doc(blog.id).set(blog),
    templatesCollection.doc(event.id).set(event),
    templatesCollection.doc(location.id).set(location),
    templatesCollection.doc(author.id).set(author),
    templatesCollection.doc(page.id).set(page),
  ]);
}
