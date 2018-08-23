import * as admin from 'firebase-admin';
import * as handlebars from 'handlebars';
import * as site from './site';
import * as templates from './templates';

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

export async function renderSitemap(docs: admin.firestore.DocumentSnapshot[]) {
  const domain = await site.getDomain();
  const siteMapEntries = docs.map(doc => {
    const docData = doc.data();
    const lastModified = docData.modifiedAt || doc.updateTime.toDate();
    return !docData.path ? '' : `
      <url>
        <loc>https://${domain}${docData.path[0]}</loc>
        <lastmod>${lastModified.toISOString().substr(0, 10)}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.5</priority>
      </url>
      `;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${siteMapEntries.join('\n')}
    </urlset>
  `;
}

export async function renderPage(doc: admin.firestore.DocumentSnapshot) {
  const templateData = await buildTemplateData(doc);
  console.log(`Render page: theme=${templateData.theme}, template=${templateData.template}`);
  const masterTemplateHtml = await injectTemplate(templateData.template, `{% include ${templateData.template}.tmpl.html %}`);

  // Compile and render the whole page
  return handlebars.compile(masterTemplateHtml)({
    context: { ...templateData.context }
  });
}

async function buildTemplateData(firestoreDocument: admin.firestore.DocumentSnapshot) {
  const docData = firestoreDocument.data();
  return {
    theme: await site.getThemeName(),
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
 * @param template Name of template file
 * @param html The HTML string in which to inject the content of `template`
 */
async function injectTemplate(template: string, html: string) {
  console.log(`Injecting template into html: ${template}`);
  const templateFile = await getTemplateFile(template);
  const [templateFileExists] = await templateFile.exists();

  if (!templateFileExists) {
    console.error(`No template file with name: ${template}`);

    if (!(template in templates.tanamDefaultTheme)) {
      console.error(`No default template for "${template}" either. Will return content "as is".`);
      return html;
    }
  }

  const regexp = RegExp(`{%\\s+include\\s+${template}\\.tmpl\\.html\\s*%}`, 'gi');
  let templateHtml = templateFileExists
    ? (await templateFile.download())[0].toString('utf8')
    : templates.tanamDefaultTheme[template];

  // Loop to see if there are any embedded template inserts in the template.
  // If so recursively inject those templates into this template.
  for (const embeddedTemplate of findTemplateInserts(templateHtml)) {
    console.log(`Found embedded template "${embeddedTemplate}"`);
    templateHtml = await injectTemplate(embeddedTemplate, templateHtml);
  }

  return html.replace(regexp, templateHtml);
}

async function buildSiteInfo() {
  const defaultData: SiteInfo = {
    name: process.env.GCLOUD_PROJECT,
    domain: `${process.env.GCLOUD_PROJECT}.firebaseapp.com`
  };

  const siteInfoData = (await admin.database().ref('site/info').once('value')).val() || {};
  return { ...defaultData, ...siteInfoData } as SiteInfo;
}

function buildContextMeta(firestoreDocument: admin.firestore.DocumentSnapshot) {
  return {
    docId: firestoreDocument.id,
    docRef: firestoreDocument.ref.path,
    createdAt: firestoreDocument.createTime.toDate(),
    updatedAt: firestoreDocument.updateTime.toDate(),
    readAt: firestoreDocument.readTime.toDate()
  } as ContextMeta;
}

async function getTemplateFile(template: string) {
  const theme = await site.getThemeName();
  console.log(`Get template file '${template}' for theme '${theme}'`);
  return admin.storage().bucket().file(`/themes/${theme}/${template}.tmpl.html`);
}