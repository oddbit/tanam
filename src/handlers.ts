import * as admin from 'firebase-admin';
import * as express from 'express';
import * as site from './site';
import * as cache from './cache';
import * as render from './render';

const supportedContentTypes = {
  'font/woff': /\.(woff)$/i,
  'font/woff2': /\.(woff2)$/i,
  'image/jpeg': /\.(jpg|jpeg)$/i,
  'image/gif': /\.(gif)$/i,
  'image/png': /\.(png)$/i,
  'image/tiff': /\.(tif|tiff)$/i,
  'image/webp': /\.(webp)$/i,
  'image/bmp': /\.(bmp)$/i,
  'image/ico': /\.(ico)$/i,
  'image/svg+xml': /\.(svg)$/i,
  'text/css': /\.(css)$/i,
  'text/javascript': /\.(js)$/i
};

export async function handleWebManifestReq(_, response: express.Response) {
  const webManifest = await getPublicHtmlFile('manifest');

  if (!webManifest.exists()) {
    console.log(`[HTTP 404] No web manifest present`);
    response.status(404).send('Not found.');
    return;
  }

  response.set('Cache-Control', cache.getCacheHeader('purgeable'));
  response.json(webManifest.val());
}

export async function handleRobotsReq(_, response: express.Response) {
  const robotsFile = await getPublicHtmlFile('robots');

  if (!robotsFile.exists()) {
    console.log(`[HTTP 404] No robots.txt file present`);
    response.status(404).send('Not found.');
    return;
  }

  response.set('Cache-Control', cache.getCacheHeader('purgeable'));
  response.send(robotsFile.val());
}


export async function handleSitemapReq(_, response: express.Response) {
  const documents = await getFirestoreDocuments();
  if (documents.length === 0) {
    console.log(`[HTTP 404] No documents, so no sitemap present either`);
    response.status(404).send('Not found.');
  }

  const siteMap = await render.renderSitemap(documents);
  response.set('Cache-Control', cache.getCacheHeader('purgeable'));
  response.set('Content-Type', 'text/xml; charset=utf-8');
  response.send(siteMap);
}

export async function handleRequest(request: express.Request, response: express.Response) {
  console.log(`${request.method.toUpperCase()} ${request.url}`);
  const contentType = getContentType(request.url);

  response.set('Tanam-Created', new Date().toUTCString());

  if (contentType.startsWith('text')) {
    await handleTextContentRequest(request, response, contentType);
  } else if (contentType.startsWith('image')) {
    await handleBinaryRequest(request, response, contentType);
  } else {
    await handlePageRequest(request, response);
  }
}

function getContentType(url: string) {
  console.log(`Resolving content type for: ${url}`);
  for (const contentType in supportedContentTypes) {
    if (supportedContentTypes[contentType].test(url)) {
      console.log(`Content type ${contentType} for: ${url}`);
      return contentType;
    }
  }

  console.log(`No special content type found for: ${url}`);
  return 'default';
}

async function handleBinaryRequest(request: express.Request, response: express.Response, contentType: string) {
  const theme = await site.getThemeName();
  const contentFile = admin.storage().bucket().file(`/themes/${theme}${request.url}`);
  const [contentExists] = await contentFile.exists();

  if (!contentExists) {
    console.log(`[HTTP 404] No media file "${request.url}" in theme "${theme}"`);
    response.status(404).send(`Not found: ${request.url}`);
    return;
  }

  const [fileContent] = await contentFile.download();
  console.log(`File size: ${fileContent.byteLength} bytes`);

  response.set('Tanam-Created', new Date().toUTCString());
  response.set('Content-Type', contentType);
  response.set('Cache-Control', cache.getCacheHeader('image'));
  response.send(fileContent);
}

async function handleTextContentRequest(request: express.Request, response: express.Response, contentType: string) {
  const theme = await site.getThemeName();
  const contentFile = admin.storage().bucket().file(`/themes/${theme}${request.url}`);
  const [contentExists] = await contentFile.exists();

  if (!contentExists) {
    console.log(`[HTTP 404] No content file "${request.url}" in theme "${theme}"`);
    response.status(404).send(`Not found: ${request.url}`);
    return;
  }

  const [fileContent] = await contentFile.download();
  console.log(`File size: ${fileContent.byteLength} bytes`);

  response.set('Tanam-Created', new Date().toUTCString());
  response.set('Content-Type', `${contentType}; charset=utf-8`);
  response.set('Cache-Control', cache.getCacheHeader('stylesheet'));
  response.send(fileContent.toString('utf8'));
}

async function handlePageRequest(request: express.Request, response: express.Response) {
  const documents = await getFirestoreDocuments(request.url);

  if (documents.length === 0) {
    console.log(`[HTTP 404] document found for: ${request.url}`);
    response.status(404).send('Not found');
    return;
  }

  if (documents.length > 1) {
    console.error(`[HTTP 500] URL '${request.url}' maps to ${documents.length} documents: ${JSON.stringify(documents.map(doc => doc.ref.path))}`);
    response.status(500).send('Database inconsistency. URL is not uniquely resolved.');
    return;
  }

  const contentDoc = documents[0];
  const pageHtml = await render.renderPage(contentDoc);

  response.set('Tanam-Created', new Date().toUTCString());
  response.set('Tanam-Id', contentDoc.ref.path);
  response.set('Cache-Control', cache.getCacheHeader('purgeable'));
  response.send(pageHtml);
}

async function getFirestoreDocuments(url?: string) {
  console.log(!!url ? `Find document matching URL: ${url}` : 'Get ALL documents n ALL collections');
  const collections = await admin.firestore().getCollections();

  console.log(`Found ${collections.length} collections: ${JSON.stringify(collections.map(coll => coll.path))}`);

  const documents: admin.firestore.DocumentSnapshot[] = [];
  for (const collection of collections) {
    const query = !!url ? collection.where('path', 'array-contains', url) : collection;
    const snap = await query.get();

    console.log(`Found ${snap.docs.length} documents in collection '${collection.path}'.`);
    snap.docs.forEach(doc => {
      documents.push(doc);
    });
  }

  console.log(`Found ${documents.length} documents in total`);
  return documents;
}

async function getPublicHtmlFile(url: string) {
  const normalizedName = url.replace('.', '_');
  const fileRef = await admin.database().ref('files').child(normalizedName).once('value');
  return fileRef.exists() ? fileRef.val() : null;
}

export function handleAdminPage(adminClientDir: string, firebaseConfig: any) {
  return render.renderAdminPage(adminClientDir, firebaseConfig);
}
