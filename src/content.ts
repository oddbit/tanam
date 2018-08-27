import * as admin from "firebase-admin";

export type ContentState = 'published' | 'unpublished';
export type TemplateType = 'dust';

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

export async function getDocumentByPath(documentPath: string) {
  console.log(`[getDocumentByPath] Fetch document: ${documentPath}`);
  const doc = await admin.firestore().doc(documentPath).get();
  if (!doc) {
    console.log(`[getDocumentByPath] Document not found: ${documentPath}`);
    return null;
  }

  return new ContentDocument(doc);
}

export async function getDocumentsInCollection(collection: string, orderBy = 'publishTime', sortOrder: FirebaseFirestore.OrderByDirection = 'desc', limit = 10) {
  const snap = await admin.firestore()
    .collection(collection)
    .where('status', '==', 'published')
    .orderBy(orderBy, sortOrder)
    .limit(limit)
    .get();

  console.log(`[dust documents] Fetched ${snap.docs.length} documents`);
  return snap.docs.map(doc => new ContentDocument(doc));
}

export async function getTemplateFiles(theme: string, templateType: TemplateType = 'dust') {
  console.log(`[getTemplateFiles] Get template files for theme '${theme}'`);

  const files = await getThemeFiles(theme);
  const dustFiles = files.filter(file => file.name.endsWith(`.${templateType}`));
  console.log(`[getTemplateFiles] Found ${dustFiles.length} ${templateType} templates.`);
  return dustFiles;
}

export async function getThemeFiles(theme: string) {
  console.log(`[getThemeFiles] Get template files for theme '${theme}'`);
  const queryOptions = {
    prefix: `themes/${theme}/`
  };

  const [files] = await admin.storage().bucket().getFiles(queryOptions);
  console.log(`[getThemeFiles] Found ${files.length} files in theme "${theme}".`);

  return files;
}