import * as dust from "dustjs-linkedin";
import * as site from "./site";
import * as admin from "firebase-admin";
import * as fs from "fs";

export type ContentState = 'published' | 'unpublished';

export interface DocumentMeta {
  id: string;
  path: string;
  createTime: Date;
  updateTime: Date;
  readTime: Date;
}

export class ContentDocument {
  readonly id: string;
  readonly meta: DocumentMeta;
  readonly data: { [key: string]: any };
  readonly path: string[];
  readonly publishTime: Date;
  readonly updateTime: Date;
  readonly template: string;

  constructor(document: admin.firestore.DocumentSnapshot) {
    this.id = document.id;
    this.meta = {
      path: document.ref.path,
      createTime: document.createTime.toDate(),
      updateTime: document.updateTime.toDate(),
      readTime: document.readTime.toDate()
    } as DocumentMeta;

    this.data = document.data().data;
    this.path = (document.data().path as string[]).slice();
    this.publishTime = document.data().publishTime;
    this.updateTime = document.data().updateTime;
    this.template = document.data().template;
  }
}

export interface TemplateContext {
  page: ContentDocument;
  site: site.SiteInfo;
}

/**
 * Fetch a single document for injection in template.
 *
 * @param chunk
 * @param context
 * @param bodies
 * @param params
 */
dust.helpers.document = async (chunk, context, bodies, params) => {
  const documentPath = params.path;
  console.log(`[dust document] Fetch document: ${documentPath}`);
  const doc = await admin.firestore().doc(documentPath).get();
  return new ContentDocument(doc);
};

/**
 * Get a list of documents for injection in template.
 *
 * @param chunk
 * @param context
 * @param bodies
 * @param params
 */
dust.helpers.documents = async (chunk, context, bodies, params) => {
  const collectionPath = params.collection;
  const limit = params.limit || 10;
  const orderBy = params.orderBy || 'publishTime';
  const sortOrder = params.sortOrder || 'desc';
  console.log(`[dust documents] Fetch documents from: ${collectionPath}`);

  const snap = await admin.firestore()
    .collection(collectionPath)
    .where('status', '==', 'published')
    .orderBy(orderBy, sortOrder)
    .limit(parseInt(limit))
    .get();

  console.log(`[dust documents] Fetched ${snap.docs.length} documents`);
  return snap.docs.map(doc => new ContentDocument(doc));
};

/**
 * Psst, unofficial support for debug dumping context data.
 *
 * @param chunk
 * @param context
 */
dust.helpers.debugDump = async function (chunk, context) {
  return JSON.stringify(context);
};

export async function renderDocument(document: admin.firestore.DocumentSnapshot) {
  const content = new ContentDocument(document);
  const theme = await site.getThemeName();
  const templateFiles = await getTemplateFiles(theme);

  for (const file of templateFiles) {
    const [fileContent] = await file.download();
    const bytesOfData = (fileContent.byteLength / 1024).toFixed(2);
    console.log(`[renderDocument] Downloaded template: ${file.name} (${bytesOfData} kB)`);

    const templateName = file.name.substring(file.name.lastIndexOf('/') + 1, file.name.lastIndexOf('.dust'));
    console.log(`[renderDocument] Compiling template: ${templateName}`);
    const source = dust.compile(fileContent.toString('utf8'), templateName);
    dust.register(templateName, dust.loadSource(source));
  }

  const context = {
    page: content,
    site: await site.getSiteInfo()
  };

  return new Promise((resolve, reject) => {
    dust.render(content.template, context, (err, out) => {
      if (err) {
        console.log(`[renderDocument] Error rendering: ${JSON.stringify(err)}`);
        reject(err);
        return;
      }

      console.log(`[renderDocument] Finished rendering`);
      resolve(out);
    });
  });
}

async function getTemplateFiles(theme: string) {
  console.log(`[getTemplateFiles] Get template files for theme '${theme}'`);
  const queryOptions = {
    prefix: `themes/${theme}/`
  };

  const [files] = await admin.storage().bucket().getFiles(queryOptions);
  const dustFiles = files.filter(file => file.name.endsWith('.dust'));
  console.log(`[getTemplateFiles] Found ${dustFiles.length} templates out of totally ${files.length} files.`);
  return dustFiles;
}

export function renderAdminPage(indexFileName: string, firebaseConfig: any) {
  const indexFile = fs.readFileSync(indexFileName, 'utf8');
  firebaseConfig['stringify'] = JSON.stringify(firebaseConfig);
  return new Promise((resolve, reject) => {
    dust.renderSource(indexFile, { fbConfig: firebaseConfig }, (err, out) => {
      if (err) {
        console.log(`Error rendering: ${JSON.stringify(err)}`);
        reject(err);
        return;
      }

      console.log(`[Finished rendering`);
      resolve(out);
    });
  });
}
