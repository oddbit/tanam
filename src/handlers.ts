import * as url from 'url';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as path from 'path';
import * as site from './site';
import * as cache from './cache';
import * as render from './render';
import * as content from './content';
import * as contentTypes from './contentTypes';

async function handleAssetRequest(request: express.Request, response: express.Response) {
  const contentFile = await content.getCloudStorageFile(request.url);
  const [contentExists] = await contentFile.exists();

  if (!contentExists) {
    console.log(`[HTTP 404] No media file: ${request.url}`);
    response.status(404).send(`Not found: ${request.url}`);
    return;
  }

  const [fileContent] = await contentFile.download();
  console.log(`[handleAssetRequest] File size: ${fileContent.byteLength} bytes`);

  response.set('Content-Type', contentTypes.getContentType(request.url));
  response.set('Tanam-Created', new Date().toUTCString());
  response.set('Cache-Control', cache.getCacheHeader());
  response.send(fileContent);
}

async function handlePageRequest(request: express.Request, response: express.Response) {
  let requestUrl = url.parse(request.url).pathname;

  if (requestUrl.endsWith('/')) {
    requestUrl += 'index.html';
  } else if (!requestUrl.endsWith('.html')) {
    requestUrl += '/index.html';
  }

  console.log(`[handlePageRequest] Using effective URL: ${requestUrl}`);
  const documents = await content.getDocumentsByUrl(requestUrl);

  if (documents.length === 0) {
    console.log(`[handlePageRequest] [HTTP 404] document found for: ${requestUrl}`);
    response.status(404).send('Not found');
    return;
  }

  if (documents.length > 1) {
    const documentList = JSON.stringify(documents.map(doc => doc.ref.path));
    console.error(`[handlePageRequest] [HTTP 500] URL '${requestUrl}' maps to ${documents.length} documents: ${documentList}`);
    response.status(500).send('Database inconsistency. URL is not uniquely resolved.');
    return;
  }

  const host = request.hostname;
  const contentDoc = documents[0];
  const pageHtml = await render.renderDocument(contentDoc);

  response.set('Tanam-Created', new Date().toUTCString());
  response.set('Tanam-Id', contentDoc.ref.path);
  response.set('Cache-Control', cache.getCacheHeader());

  const primaryDomain = await site.getPrimaryDomain();
  if (primaryDomain !== host) {
    console.log(`[handlePageRequest] Request is on secondary domain '${host}'. Adding canonical link to: ${primaryDomain}`);
    const htmlWithCanonicalLink = pageHtml
      .replace(
        /<\/head>/gi,
        `<link rel="canonical" href="https://${primaryDomain}${request.url}" /></head>`);
    response.send(htmlWithCanonicalLink);
  } else {
    response.send(pageHtml);
  }
}

export async function handlePublicDirectoryFileReq(request: express.Request, response: express.Response) {
  const requestUrl = url.parse(request.url).pathname;
  console.log(`[handlePublicDirectoryFileReq] ${request.method.toUpperCase()} ${requestUrl}`);
  const normalizedName = requestUrl.replace('.', '_');
  const fileRef = await admin.database().ref('publicFiles').child(normalizedName).once('value');

  if (!fileRef.exists()) {
    console.log(`[HTTP 404] No ${requestUrl} file present`);
    response.status(404).send('Not found.');
    return;
  }

  response.set('Tanam-Created', new Date().toUTCString());
  response.set('Cache-Control', cache.getCacheHeader());
  response.set('Content-Type', contentTypes.getContentType(requestUrl));
  response.send(fileRef.val());
}

export async function handleSitemapReq(request: express.Request, response: express.Response) {
  console.log(`[handleSitemapReq] ${request.method.toUpperCase()} ${request.url}`);
  const documents = await content.getAllDocuments();
  if (documents.length === 0) {
    console.log(`[HTTP 404] No documents, so no sitemap present either`);
    response.status(404).send('Not found.');
  }

  const domain = await site.getPrimaryDomain();
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

  response.set('Tanam-Created', new Date().toUTCString());
  response.set('Cache-Control', cache.getCacheHeader());
  response.set('Content-Type', 'text/xml; charset=utf-8');
  response.send(siteMap);
}

export async function handleRequest(request: express.Request, response: express.Response) {
  const host = request.hostname;
  const requestUrl = url.parse(request.url).pathname;

  console.log(`[handleRequest] ${request.method.toUpperCase()} ${host}${requestUrl}`);
  await cache.registerRequestHost(host);

  if (contentTypes.getContentType(requestUrl) === 'default') {
    await handlePageRequest(request, response);
  } else {
    await handleAssetRequest(request, response);
  }
}

export async function handleAdminPage(response: express.Response, adminClientDir: string, firebaseConfig: any) {
  const indexFileName = path.join(adminClientDir, '/index.html');
  const compiledHtml = await render.renderAdminPage(indexFileName, firebaseConfig);

  response.send(compiledHtml);
}
