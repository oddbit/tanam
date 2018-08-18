import * as firebase from 'firebase-admin';
import * as handlebars from 'handlebars';

export interface SiteInfo {
  name: string;
  domain: string;
  // TODO: More info
}

export enum ContentState { Unpublished, Published, Deleted }

export interface ContextMeta {
  docId: string;
  docRef: string;
  createdAt: Date;
  updatedAt: Date;
  readAt: Date;
}

export interface TemplateData {
  theme: string;              // Name of the theme to use
  template: string;           // Name of the template to use (will match a file name)
  permalink: string;          // URL for this page/post
  status: ContentState;       // Current status of the post/page
  publishDate: Date;          // Date when the post was set to 'published'
  site: SiteInfo;             // Site global information
  context: any;               // Contextual data for the page or post to render
  contextMeta: ContextMeta;   // Meta data for the page or post to render
}

export async function renderPage(templateData: TemplateData) {
  // The content post has a corresponding template file in the theme folder. This makes it possible to display
  // 'blog' posts differently from 'event' posts etc
  const contentPostTemlateFile = firebase.storage().bucket().file(`/themes/${templateData.theme}/${templateData.template}.tmpl.html`);
  const contentPostTemplateHtml = (await contentPostTemlateFile.exists())
    ? (await contentPostTemlateFile.download())[0].toString('utf8')
    : '<div>This is default template for {{ title }}</div>';

  // The master template contains the header, footer and everything that wraps the content type
  const masterTemplateFile = firebase.storage().bucket().file(`/themes/${templateData.theme}/master.tmpl.html`);
  const masterTemplateHtml = (await masterTemplateFile.exists())
    ? (await masterTemplateFile.download())[0].toString('utf8')
    : `
    <!DOCTYPE html>

    <html lang="en">
      <head>
      <title>${templateData.site.name}</title></head>
      <body>{% include ${templateData.template}.tmpl.html %}</body>
    </html>
  `;

  // Replace/inject sub-templates with Jekyll style markup: {% include filename.tmpl.html %}
  // FIXME: The regex finds **any** match of the pattern, regadless of the document template name
  const templateRegex = /{%\s+include\s+(.*\.tmpl\.html)\s*%}/gi;
  const assembledPageTemplate = masterTemplateHtml.replace(templateRegex, contentPostTemplateHtml);

  // Compile and render the whole page
  return handlebars.compile(assembledPageTemplate);
}

export async function buildTemplateData(firestoreDocument: firebase.firestore.DocumentSnapshot) {
  const docData = firestoreDocument.data();
  return {
    theme: (await firebase.database().ref('site/settings/theme').once('value')).val() || 'default',
    template: docData.template,
    permalink: docData.permalink,
    site: await buildSiteInfo(),
    context: docData.data || {},
    contextMeta: buildContextMeta(firestoreDocument)
  } as TemplateData;
}

async function buildSiteInfo() {
  const defaultData: SiteInfo = {
    name: process.env.GCLOUD_PROJECT,
    domain: `${process.env.GCLOUD_PROJECT}.firebaseapp.com`
  };

  const siteInfoData = (await firebase.database().ref('site/info').once('value')).val() || {};
  return { ...defaultData, ...siteInfoData } as SiteInfo;
}

function buildContextMeta(firestoreDocument: firebase.firestore.DocumentSnapshot) {
  return {
    docId: firestoreDocument.id,
    docRef: firestoreDocument.ref.toString(),
    createdAt: firestoreDocument.createTime.toDate(),
    updatedAt: firestoreDocument.updateTime.toDate(),
    readAt: firestoreDocument.readTime.toDate()
  } as ContextMeta;
}