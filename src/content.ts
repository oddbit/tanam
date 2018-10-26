import { SHA256 } from 'crypto-js';
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

export interface ContentDocument {
  data: { [key: string]: any };   // Contains the document's contextual data (title, body, images, etc)
  path: string[];                 // Array of path sections. Index 0 always contain the full permalink
  publishTime: Date;              // Time of publishing the document/page (manually, unrestricted set by author)
  updateTime: Date;               // Automatic timestamp of the latest time the document was updated
  template: string;               // Name of the template to use (name of file in the theme)
  status: ContentState;           // Document's publish status
  tags: string[];                 // Optional document tags
}

/**
 * Page context class is the object that is passed into the template and can be accessed via the `page` attribute.
 *
 * The attributes are much like the ones of `ContentDocument` with the difference that some additional data is added
 * and simplified for use in template. This is like the "public API" version of `ContentDocument`.
 *
 * The `url` and `template` attributes are optional, since it is possible to have content that does not offer a URL
 * to access them on. Examples of that would be for example to create a dynamic pricing table on the website where
 * it will always be displayed as an embedded part of another page. Or for example "addresses" that should only be
 * placed in a list on the contact page. Both types might want to offer a rich set of information in the `data`
 * attribute, but neither of them need to have a page that you can access them individually.
 *
 * ## Example DocumentContext
 *
 * ```
 *  {
 *    meta: {
 *      id: "0NcBcuKolxZNqJHmqtcF",
 *      path: "/blog/0NcBcuKolxZNqJHmqtcF",
 *      collection: "blog",
 *      createTime: <Date>,
 *      updateTime: <Date>,
 *      readTime: <Date>,
 *    },
 *    data: {
 *      title: "My blog post",
 *      body: "Lorem ipsum...",
 *      feaaturedImage: "/content/images/my-featured-image.jpg",
 *      somethingElse: "You can add what ever fields you want",
 *      forReal: true,
 *      whenWasThat: <Date>
 *    },
 *    url: "/blog/2018/my-blog-post",
 *    publishTime: <Date>,
 *    status: "published",
 *    updateTime: <Date>,
 *    template: "blog",
 *    tags: ["fun", "profit"],
 *  }
 * ```
 *
 */
export class DocumentContext {
  readonly meta: DocumentMeta;
  readonly data: { [key: string]: any };
  readonly url?: string;
  readonly status: ContentState;
  readonly publishTime: Date;
  readonly updateTime: Date;
  readonly template?: string;
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
    this.data = !!contentDocument.data ? { ...contentDocument.data } : {};
    this.url = !!contentDocument.path ? contentDocument.path[0] : null;
    this.status = contentDocument.status || 'unpublished';
    this.publishTime = !!contentDocument.publishTime ? new Date(contentDocument.publishTime) : new Date();
    this.updateTime = !!contentDocument.updateTime ? new Date(contentDocument.updateTime) : new Date();
    this.template = contentDocument.template || null;
    this.tags = (contentDocument.tags || []).slice();
  }
}

/**
 * The "template context" is the largest set of data about the page and the site, which is injected at the highest level
 * with the "main template" that is being rendered. That means that this is the data that is avaialble to the whole page
 * during rendering.
 *
 * This is different from the "page context" that can be found in "sub templates" that are injected on a page.
 *
 * For example, on a page that lists blog posts, each list item (blog post) would be a `DocumentContext` while only the
 * page itself would contain all the data of `PageContext`.
 */
export class PageContext {
  readonly site: site.SiteInfo;
  readonly page: DocumentContext;

  private constructor(_site: site.SiteInfo, _page: DocumentContext) {
    this.site = _site;
    this.page = _page;
  }

  static async createForDocument(data: DocumentContext) {
    const siteData = await site.getSiteInfo();
    return new PageContext(siteData, data);
  }
}

/**
 * Get all documents in all collections.
 *
 * Returns an array of Firestore `DocumentSnapshot`
 */
export function getAllDocuments() {
  return getDocumentsByUrl();
}

/**
 * Find all documents that matches a certain URL.
 * A document with the URL `/blogs/2013/06/14/a-new-beginning.html` will match `/blogs/2013/06/` together with any
 * other document that has a URL starting with that URL, e.g. `/blogs/2013/06/24/yet-another-one.html`
 *
 * Returns an array of Firestore `DocumentSnapshot`
 *
 * @param requestUrl Optional URL to match documents by.
 */
export async function getDocumentsByUrl(requestUrl?: string) {
  const urlPath = !!requestUrl ? url.parse(requestUrl).pathname : '';
  console.log(!!requestUrl ? `Find document matching URL: ${requestUrl}` : 'Get ALL documents in ALL collections');

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

/**
 * Get a specific document by its collection name and document id.
 * E.g. `blogposts/00EbMmZ1SaePruNgosmZ`
 *
 * @param documentPath A fully qualified colletion and document id
 */
export async function getDocumentByPath(documentPath: string) {
  console.log(`[getDocumentByPath] Fetch document: ${documentPath}`);
  const doc = await admin.firestore().doc(documentPath).get();
  if (!doc) {
    console.log(`[getDocumentByPath] Document not found: ${documentPath}`);
    return null;
  }

  return new DocumentContext(doc);
}

/**
 * Get documents in a collection based on query criteria.
 * This method will only get documents with status `published` as it is an interface for usage in template and API calls.
 *
 * @param collection Name of the collection
 * @param orderBy Attribute name to order by
 * @param sortOrder Sort order: `asc` or `desc`
 * @param limit Number of documents to limit to
 */
export async function getDocumentsInCollection(collection: string, orderBy = 'publishTime', sortOrder: FirebaseFirestore.OrderByDirection = 'desc', limit = 10) {
  console.log(`[getDocumentsInCollection] collection=${collection}, orderBy=${orderBy}, sortOrder=${sortOrder}, limit=${limit}`);

  try {
    const snap = await admin.firestore()
      .collection(collection)
      .where('status', '==', 'published')
      .orderBy(orderBy, sortOrder)
      .limit(limit)
      .get();

    console.log(`[getDocumentsInCollection] Fetched ${snap.docs.length} documents`);
    return snap.docs.map(doc => new DocumentContext(doc));
  } catch (err) {

    // This is reported in https://jetbrains.oddbit.id/youtrack/issue/TNM-108
    console.error(`[getDocumentsInCollection] Could not get documents: ${err.message}`);
    return [];
  }
}

/**
 * Get all the template files in the current theme.
 *
 * Returns an array of template files of the current theme.
 *
 * @param theme Name of the current active theme
 * @param templateType Type of template files to look for
 */
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

/**
 * Get a file from cloud storage as requested from the public reference.
 *
 * A reference to a file in a specific theme will start with `/theme/`, for example `/theme/stylesheet.css`
 * and that will reference the `stylesheet.css` in the current theme. And if the theme is changed, it will
 * look for a CSS file with the same name in the new theme folder.
 *
 * User content files such as image uploads etc should be located in the cloud storage path `/content/`,
 * e.g. `/content/images/myimage.png`.
 *
 * @param requestUrl The URL of the requested file
 */
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

/**
 * Get a public usable file path for a cloud storage file.
 * The path that is returned to a template or used from a client perspective must always be normalized
 * by this function in order to later be able to reverse the lookup with `getCloudStorageFile()` above.
 *
 * @param storageFilePath Absolute path to a cloud storage file
 */
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

/**
 * Cloud function that triggers on each user content file upload.
 * For each file upload, update metadata registry "lookup table". The metadata registry is used to reverse
 * lookup files of certain content type or date.
 */
export const tanam_onFileFinalizedUpdateRegistry = functions.storage.object().onFinalize((object) => {
  if (!object.name.startsWith('content/')) {
    console.log(`File is not a user content file. Ignoring it.`);
    return null;
  }

  console.log(`File updated: gs://${object.bucket}/${object.name} (${object.md5Hash})`);
  const id = SHA256(object.bucket + object.name + object.timeCreated).toString().toLowerCase();
  const data = {
    bucket: object.bucket,
    name: object.name,
    md5: object.md5Hash,
    updateTime: admin.database.ServerValue.TIMESTAMP,
    contentType: object.contentType,
    fileType: object.contentType.split('/')[0]
  };

  return admin.database().ref(ContentFirebasePath.fileMetaData).child(id).set(data);
});

/**
 * Cloud function that triggers on each user content file upload.
 * For each user content file that is deleted, remove its entry in metadata registry.
 */
export const tanam_onFileDeleteUpdateRegistry = functions.storage.object().onDelete(async (object) => {
  if (!object.name.startsWith('content/')) {
    console.log(`File is not a user content file. Ignoring it.`);
    return null;
  }

  console.log(`File deleted: gs://${object.bucket}/${object.name} (${object.md5Hash})`);
  const id = SHA256(object.bucket + object.name + object.timeCreated).toString().toLowerCase();
  return admin.database().ref(ContentFirebasePath.fileMetaData).child(id).remove();
});
