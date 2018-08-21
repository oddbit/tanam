import * as firebase from 'firebase-admin';
import * as handlebars from 'handlebars';
import * as defaultTemplate from './default';

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

/**
 * Render the page by fetching the "master" template to render the page with.
 *
 * @param templateData
 */
export async function renderPage(templateData: TemplateData) {
  console.log(`Render page: theme=${templateData.theme}, template=${templateData.template}`);
  const masterTemplateHtml = await injectTemplate(templateData.theme, templateData.template, `{% include ${templateData.template}.tmpl.html %}`);

  // Compile and render the whole page
  return handlebars.compile(masterTemplateHtml)({
    context: { ...templateData.context }
  });
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

/**
 * Finds all occurances of template inclusion statements `{% include filename.tmpl.html %}` and returns an
 * array of template names.
 *
 * @param html Template HTML string
 */
function findTemplateInserts(html) {
  const regexpStr = '{%\\s+include\\s+(.*)\\.tmpl\\.html\\s*%}';
  const matchedString = html.match(new RegExp(regexpStr, 'gi')) || [];
  return matchedString
    .map((regexpMatch) => regexpMatch.match(new RegExp(regexpStr, 'i'))[1]);
}

/**
 * Injects one template file into another where it is marked up with "include" statement (i.e. `{% include filename.tmpl.html %}`)
 *
 * @param theme Name of theme
 * @param template Name of template file
 * @param html The HTML string in which to inject the content of `template`
 */
async function injectTemplate(theme: string, template: string, html: string) {
  console.log(`Injecting template into html: theme=${theme}, template=${template}`);
  const templateFile = firebase.storage().bucket().file(`/themes/${theme}/${template}.tmpl.html`);

  const [templateFileExists] = await templateFile.exists();

  if (!templateFileExists) {
    console.error(`No file template file "${template}" in theme "${theme}"`);

    if (!(template in defaultTemplate.templateMap)) {
      console.error(`No default template for "${template}" either. Will return content "as is".`);
      return html;
    }
  }

  const regexp = RegExp(`{%\\s+include\\s+${template}\\.tmpl\\.html\\s*%}`, 'gi');
  let templateHtml = templateFileExists
    ? (await templateFile.download())[0].toString('utf8')
    : defaultTemplate.templateMap[template];

  // Loop to see if there are any embedded template inserts in the template.
  // If so recursively inject those templates into this template.
  for (const embeddedTemplate of findTemplateInserts(templateHtml)) {
    console.log(`Found embedded template "${embeddedTemplate}"`);
    templateHtml = await injectTemplate(theme, embeddedTemplate, templateHtml);
  }

  return html.replace(regexp, templateHtml);
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
    docRef: firestoreDocument.ref.path,
    createdAt: firestoreDocument.createTime.toDate(),
    updatedAt: firestoreDocument.updateTime.toDate(),
    readAt: firestoreDocument.readTime.toDate()
  } as ContextMeta;
}