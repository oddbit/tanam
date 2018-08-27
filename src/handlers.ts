import * as url from 'url';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as path from 'path';
import * as site from './site';
import * as cache from './cache';
import * as render from './render';
import * as content from './content';

const supportedContentTypes = {
  'font/otf': /\.(otf)$/i,
  'font/ttf': /\.(ttf)$/i,
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
  'text/plain; charset=utf-8': /\.(txt)$/i,
  'text/css; charset=utf-8': /\.(css)$/i,
  'text/javascript; charset=utf-8': /\.(js)$/i,
  'application/json; charset=utf-8': /\.(json)$/i
};

async function handleAssetRequest(request: express.Request, response: express.Response) {
  console.log(`[handleAssetRequest] ${request.method.toUpperCase()} ${request.url}`);
  const contentFile = await content.getCloudStorageFile(request.url);
  const [contentExists] = await contentFile.exists();

  if (!contentExists) {
    console.log(`[HTTP 404] No media file: ${request.url}`);
    response.status(404).send(`Not found: ${request.url}`);
    return;
  }

  const [fileContent] = await contentFile.download();
  console.log(`[handleAssetRequest] File size: ${fileContent.byteLength} bytes`);

  response.set('Content-Type', getContentType(request.url));
  response.set('Tanam-Created', new Date().toUTCString());
  response.set('Cache-Control', cache.getCacheHeader('image'));
  response.send(fileContent);
}

async function handlePageRequest(request: express.Request, response: express.Response) {
  const requestUrl = url.parse(request.url).pathname;
  const documents = await content.getDocumentsByUrl(requestUrl);

  if (documents.length === 0) {
    console.log(`[HTTP 404] document found for: ${requestUrl}`);
    response.status(404).send('Not found');
    return;
  }

  if (documents.length > 1) {
    const documentList = JSON.stringify(documents.map(doc => doc.ref.path));
    console.error(`[HTTP 500] URL '${requestUrl}' maps to ${documents.length} documents: ${documentList}`);
    response.status(500).send('Database inconsistency. URL is not uniquely resolved.');
    return;
  }

  const contentDoc = documents[0];
  const pageHtml = await render.renderDocument(contentDoc);

  response.set('Tanam-Created', new Date().toUTCString());
  response.set('Tanam-Id', contentDoc.ref.path);
  response.set('Cache-Control', cache.getCacheHeader('purgeable'));
  response.send(pageHtml);
}

export async function handlePublicDirectoryFileReq(request: express.Request, response: express.Response) {
  const requestUrl = url.parse(request.url).pathname;
  console.log(`${request.method.toUpperCase()} ${requestUrl}`);
  const normalizedName = requestUrl.replace('.', '_');
  const fileRef = await admin.database().ref('publicFiles').child(normalizedName).once('value');

  if (!fileRef.exists()) {
    console.log(`[HTTP 404] No ${requestUrl} file present`);
    response.status(404).send('Not found.');
    return;
  }

  response.set('Cache-Control', cache.getCacheHeader('purgeable'));
  response.set('Content-Type', getContentType(requestUrl));
  response.send(fileRef.val());
}

export async function handleSitemapReq(request: express.Request, response: express.Response) {
  console.log(`${request.method.toUpperCase()} ${request.url}`);
  const documents = await content.getAllDocuments();
  if (documents.length === 0) {
    console.log(`[HTTP 404] No documents, so no sitemap present either`);
    response.status(404).send('Not found.');
  }

  const domain = await site.getDomain();
  const siteMapEntries = documents.filter(doc => !!doc.data().path).map(doc => {
    const docData = doc.data();
    const lastModified = docData.modifiedAt || doc.updateTime.toDate();
    return [
      `  <url>`,
      `    <loc>https://${domain}${docData.path[0]}</loc>`,
      `    <lastmod>${lastModified.toISOString().substr(0, 10)}</lastmod>`,
      `    <changefreq>weekly</changefreq>`,
      `    <priority>0.5</priority>`,
      `  </url>`
    ].join('\n');
  });

  const siteMap = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    siteMapEntries.join('\n'),
    `</urlset>`].join('\n');

  response.set('Cache-Control', cache.getCacheHeader('purgeable'));
  response.set('Content-Type', 'text/xml; charset=utf-8');
  response.send(siteMap);
}

export async function handleRequest(request: express.Request, response: express.Response) {
  const requestUrl = url.parse(request.url).pathname;
  console.log(`${request.method.toUpperCase()} ${requestUrl}`);

  response.set('Tanam-Created', new Date().toUTCString());

  if (getContentType(requestUrl) === 'default') {
    await handlePageRequest(request, response);
  } else {
    await handleAssetRequest(request, response);
  }
}

function getContentType(requestUrl: string) {
  const requestPath = url.parse(requestUrl).pathname;
  console.log(`Resolving content type for: ${requestPath}`);
  for (const contentType in supportedContentTypes) {
    if (supportedContentTypes[contentType].test(requestPath)) {
      console.log(`Content type ${contentType} for: ${requestPath}`);
      return contentType;
    }
  }

  console.log(`No special content type found for: ${requestPath}`);
  return 'default';
}

export async function handleAdminPage(response: express.Response, adminClientDir: string, firebaseConfig: any) {
  const indexFileName = path.join(adminClientDir, '/index.html');
  const compiledHtml = await render.renderAdminPage(indexFileName, firebaseConfig);

  response.send(compiledHtml);
}
