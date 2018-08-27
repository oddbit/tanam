import * as url from 'url';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as path from 'path';
import * as site from './site';
import * as cache from './cache';
import * as render from './render';
import * as content from './content';

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
  const contentType = getContentType(requestUrl);

  response.set('Tanam-Created', new Date().toUTCString());

  if (contentType.startsWith('text')) {
    await handleTextAssetRequest(request, response, contentType);
  } else if (contentType.startsWith('image')) {
    await handleBinaryRequest(request, response, contentType);
  } else {
    await handlePageRequest(request, response);
  }
}

function getContentType(requestUrl: string) {
  console.log(`Resolving content type for: ${requestUrl}`);
  for (const contentType in supportedContentTypes) {
    if (supportedContentTypes[contentType].test(requestUrl)) {
      console.log(`Content type ${contentType} for: ${requestUrl}`);
      return contentType;
    }
  }

  console.log(`No special content type found for: ${requestUrl}`);
  return 'default';
}

async function handleBinaryRequest(request: express.Request, response: express.Response, contentType: string) {
  const requestUrl = url.parse(request.url).pathname;
  const theme = await site.getThemeName();
  const assetFilePath = `/themes/${theme}${requestUrl}`;
  const contentFile = admin.storage().bucket().file(assetFilePath);
  const [contentExists] = await contentFile.exists();

  if (!contentExists) {
    console.log(`[HTTP 404] No media file: ${assetFilePath}`);
    response.status(404).send(`Not found: ${requestUrl}`);
    return;
  }

  const [fileContent] = await contentFile.download();
  console.log(`File size: ${fileContent.byteLength} bytes`);

  response.set('Tanam-Created', new Date().toUTCString());
  response.set('Content-Type', contentType);
  response.set('Cache-Control', cache.getCacheHeader('image'));
  response.send(fileContent);
}

async function handleTextAssetRequest(request: express.Request, response: express.Response, contentType: string) {
  const requestUrl = url.parse(request.url).pathname;
  const theme = await site.getThemeName();
  const assetFilePath = `/themes/${theme}${requestUrl}`;
  const contentFile = admin.storage().bucket().file(assetFilePath);
  const [contentExists] = await contentFile.exists();

  if (!contentExists) {
    console.log(`[HTTP 404] No text asset file: ${assetFilePath}`);
    response.status(404).send(`Not found: ${requestUrl}`);
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



async function getPublicHtmlFile(requestUrl: string) {
  const normalizedName = requestUrl.replace('.', '_');
  const fileRef = await admin.database().ref('files').child(normalizedName).once('value');
  return fileRef.exists() ? fileRef.val() : null;
}

export async function handleAdminPage(response: express.Response, adminClientDir: string, firebaseConfig: any) {
  const indexFileName = path.join(adminClientDir, '/index.html');
  const compiledHtml = await render.renderAdminPage(indexFileName, firebaseConfig);

  response.send(compiledHtml);
}
