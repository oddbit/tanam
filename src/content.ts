import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as url from 'url';
import * as site from './site';

export type ContentState = 'published' | 'unpublished';
export type TemplateType = 'dust';

export abstract class ContentFirebasePath {
  static readonly fileMetaData = 'contentFiles';
}

export interface DocumentMeta {
  id: string;           // The document's ID
  path: string;         // The fully qualified path to the document
  collection: string;   // Name of the document's collection
  createTime: Date;     // Time of creation
  updateTime: Date;     // Time updated
  readTime: Date;       // Time of read
}

interface ContentDocument {
  data: { [key: string]: any };   // Contains the document's contextual data (title, body, images, etc)
  path: string[];                 // Array of path sections. Index 0 always contain the full permalink
  publishTime: Date;              // Time of publishing the document/page (manually, unrestricted set by author)
  updateTime: Date;               // Automatic timestamp of the latest time the document was updated
  template: string;               // Name of the template to use (name of file in the theme)
  status: ContentState;           // Document's publish status
  tags: string[];                 // Optional document tags
}

class ContentFileMeta {
  readonly name: string;
  readonly bucket: string;
  readonly md5: string;
  readonly updateTime: number;
  readonly contentType: string;

  constructor(fileObject: functions.storage.ObjectMetadata) {
    this.name = fileObject.name;
    this.bucket = fileObject.bucket;
    this.md5 = fileObject.md5Hash;
    this.updateTime = admin.database.ServerValue.TIMESTAMP;
    this.contentType = fileObject.contentType;
  }

  isEqual(other: ContentFileMeta) {
    return this.name === other.name && this.bucket === other.bucket && this.md5 === other.md5;
  }

  toString() {
    return `gs://${this.bucket}/${this.name} (${this.md5})`;
  }
}
/**
 * Page context class is the object that is passed into the template and can be accessed via the `page` attribute.
 */
export class PageContext {
  readonly meta: DocumentMeta;
  readonly data: { [key: string]: any };
  readonly path: string[];
  readonly publishTime: Date;
  readonly updateTime: Date;
  readonly template: string;
  readonly tags: string[];

  constructor(document: admin.firestore.DocumentSnapshot) {
    this.meta = {
      id: document.id,
      path: document.ref.path,
      collection: document.ref.parent.path,
      createTime: document.createTime.toDate(),
      updateTime: document.updateTime.toDate(),
      readTime: document.readTime.toDate()
    } as DocumentMeta;

    const contentDocument = document.data() as ContentDocument;
    this.data = contentDocument.data;
    this.path = contentDocument.path.slice();
    this.publishTime = contentDocument.publishTime;
    this.updateTime = contentDocument.updateTime;
    this.template = contentDocument.template;
    this.tags = (contentDocument.tags || []).slice();
  }
}

export async function getDocumentByPath(documentPath: string) {
  console.log(`[getDocumentByPath] Fetch document: ${documentPath}`);
  const doc = await admin.firestore().doc(documentPath).get();
  if (!doc) {
    console.log(`[getDocumentByPath] Document not found: ${documentPath}`);
    return null;
  }

  return new PageContext(doc);
}

export function getAllDocuments() {
  return getDocumentsByUrl();
}

export async function getDocumentsByUrl(requestUrl?: string) {
  const urlPath = !!requestUrl ? url.parse(requestUrl).pathname : '';
  console.log(!!requestUrl ? `Find document matching URL: ${requestUrl}` : 'Get ALL documents n ALL collections');

  const documents: admin.firestore.DocumentSnapshot[] = [];
  const collections = await admin.firestore().getCollections();
  console.log(`Found ${collections.length} collections: ${JSON.stringify(collections.map(coll => coll.path))}`);
  for (const collection of collections) {
    const query = !!urlPath ? collection.where('path', 'array-contains', urlPath) : collection;
    const snap = await query.get();

    console.log(`Found ${snap.docs.length} documents in collection '${collection.path}'.`);
    snap.docs.forEach(doc => {
      documents.push(doc);
    });
  }

  console.log(`Found ${documents.length} documents in total.`);

  return documents.filter(doc => (doc.data() as ContentDocument).status === 'published');
}

export async function getDocumentsInCollection(collection: string, orderBy = 'publishTime', sortOrder: FirebaseFirestore.OrderByDirection = 'desc', limit = 10) {
  const snap = await admin.firestore()
    .collection(collection)
    .where('status', '==', 'published')
    .orderBy(orderBy, sortOrder)
    .limit(limit)
    .get();

  console.log(`[dust documents] Fetched ${snap.docs.length} documents`);
  return snap.docs.map(doc => new PageContext(doc));
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

export async function getCloudStorageFile(requestUrl: string) {
  let assetFilePath = url.parse(requestUrl).pathname;

  if (assetFilePath.startsWith('/theme/')) {
    const pathPart = assetFilePath.substr('/theme/'.length);
    const theme = await site.getThemeName();
    assetFilePath = `/themes/${theme}/${pathPart}`;
  } else if (!assetFilePath.startsWith('/content/')) {
    assetFilePath = `/content${assetFilePath}`;
  }

  console.log(`[getCloudStorageFile] requestUrl=${requestUrl}, assetFilePath=${assetFilePath}`);
  return admin.storage().bucket().file(assetFilePath);
}

export function getPublicPathToStorageFile(storageFilePath: string) {
  console.log(`[getPublicPathToStorageFile] storageFilePath=${storageFilePath}`);
  if (storageFilePath.startsWith('/themes/') || storageFilePath.startsWith('themes/')) {
    // Removes the "themes/<theme name>" and makes it into a path that will resolve as a Tanam theme file should
    const publicPath = '/theme/' + storageFilePath.split('/').filter(item => !!item).splice(2).join('/');
    console.log(`[getPublicPathToStorageFile] storageFilePath=${storageFilePath} => ${publicPath}`);
    return publicPath;
  }

  return storageFilePath.startsWith('/') ? storageFilePath : `/${storageFilePath}`;
}

export const tanam_onFileChangeUpdateRegistry = functions.storage.object().onFinalize((object) => {
  const updatedFile = new ContentFileMeta(object);
  console.log(`File updated: ${updatedFile}.`);
  return admin.database().ref(ContentFirebasePath.fileMetaData).push(updatedFile);
});

export const tanam_onFileDeleteUpdateRegistry = functions.storage.object().onDelete(async (object) => {
  const promises = [];
  const deletedFile = new ContentFileMeta(object);
  console.log(`File deleted: ${deletedFile}.`);
  const querySnap = await admin.database()
    .ref(ContentFirebasePath.fileMetaData)
    .orderByChild('md5')
    .equalTo(deletedFile.md5)
    .once('value');

  querySnap.forEach(dataSnap => {
    const foundFile = dataSnap.val() as ContentFileMeta;
    if (deletedFile.isEqual(foundFile)) {
      console.log(`Removing meta data at: ${dataSnap.ref.path}`);
      promises.push(dataSnap.ref.remove());
      return true;
    }
    return false;
  });

  return Promise.all(promises);
});