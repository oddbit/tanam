import * as admin from 'firebase-admin';
import { SiteInformation, ThemeTemplate } from '../../../models';

const siteCollection = () => admin.firestore().collection('tanam').doc(process.env.GCLOUD_PROJECT);

export async function getTemplates() {
    const siteInfo = (await siteCollection().get()).data() as SiteInformation;
    console.log(`[getTemplates] Finding templates for theme: ${siteInfo.theme}`);
    const templatesSnap = await siteCollection()
        .collection('themes').doc(siteInfo.theme)
        .collection('templates')
        .get();

    console.log(`[getTemplates] Number of templates found: ${templatesSnap.docs.length}`);
    return templatesSnap.docs.map(doc => doc.data() as ThemeTemplate);
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
        <h1>{context.title}</h1>
        <img src="{context.data.featuredImage}" />
        {#context.data.author}
            <p><a href="{profileUrl}">{name}</a></p>
        {/context.data.author}
        <p>{context.data.content|s}</p>
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
        <h1>{context.title}</h1>
        <img src="{context.data.featuredImage}" />
        <div class="event-dates">
            <span>{context.data.timeStart}</span>
            <span>{context.data.timeEnd}</span>
        </div>
        {#context.data.location}
            <p><a href="{mapUrl}">{name}</a></p>
        {/context.data.location}
        <p>{context.data.content|s}</p>
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
        {@select key=context.data.layout}
            {@eq value="landing-page"}Show a landing page layout{/eq}
            {@eq value="right-sidebar"}Include a right sidebar page template{/eq}
            {@none} Display the regular page layout {/none}
        {/select}
        `,
    };

    console.log(`[createDefaultTemplates] ${JSON.stringify({ blog, event, page }, null, 2)}`);

    return Promise.all([
        templatesCollection.doc(blog.id).set(blog),
        templatesCollection.doc(event.id).set(event),
        templatesCollection.doc(page.id).set(page),
    ]);
}
