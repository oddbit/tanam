import * as url from 'url';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as path from 'path';
import * as site from './site';
import * as cache from './cache';
import * as render from './render';
import * as content from './content';

const supportedContentTypes = {
  'audio/aac': /\.(aac)$/i,
  'application/x-abiword': /\.(abw)$/i,
  'application/octet-stream': /\.(arc|bin)$/i,
  'video/x-msvideo': /\.(avi)$/i,
  'application/vnd.amazon.ebook': /\.(azw)$/i,
  'application/x-bzip': /\.(bz)$/i,
  'application/x-bzip2': /\.(bz2)$/i,
  'application/x-csh': /\.(csh)$/i,
  'text/csv; charset=utf-8': /\.(csv)$/i,
  'application/msword': /\.(doc)$/i,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': /\.(docx)$/i,
  'application/vnd.ms-fontobject': /\.(eot)$/i,
  'application/epub+zip': /\.(epub)$/i,
  'application/ecmascript; charset=utf-8': /\.(es)$/i,
  'text/calendar; charset=utf-8': /\.(ics)$/i,
  'application/java-archive': /\.(jar)$/i,
  'audio/midi': /\.(mid|midi)$/i,
  'video/mpeg': /\.(mpeg)$/i,
  'application/vnd.apple.installer+xml': /\.(mpkg)$/i,
  'application/vnd.oasis.opendocument.presentation': /\.(odp)$/i,
  'application/vnd.oasis.opendocument.spreadsheet': /\.(ods)$/i,
  'application/vnd.oasis.opendocument.text': /\.(odt)$/i,
  'audio/ogg': /\.(oga)$/i,
  'video/ogg': /\.(ogv)$/i,
  'application/ogg': /\.(ogx)$/i,
  'application/pdf': /\.(pdf)$/i,
  'application/vnd.ms-powerpoint': /\.(ppt)$/i,
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': /\.(pptx)$/i,
  'application/x-rar-compressed': /\.(rar)$/i,
  'application/rtf': /\.(rtf)$/i,
  'application/x-sh; charset=utf-8': /\.(sh)$/i,
  'application/x-tar': /\.(tar)$/i,
  'application/typescript; charset=utf-8': /\.(ts)$/i,
  'application/vnd.visio': /\.(vsd)$/i,
  'audio/wav': /\.(wav)$/i,
  'audio/webm': /\.(weba)$/i,
  'video/webm': /\.(webm)$/i,
  'image/webp': /\.(webp)$/i,
  'application/vnd.ms-excel': /\.(xls)$/i,
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': /\.(xlsx)$/i,
  'application/xml; charset=utf-8': /\.(xml)$/i,
  'application/vnd.mozilla.xul+xml': /\.(xul)$/i,
  'application/zip': /\.(zip)$/i,
  'application/x-7z-compressed': /\.(7z)$/i,
  'font/otf': /\.(otf)$/i,
  'font/ttf': /\.(ttf)$/i,
  'font/woff': /\.(woff)$/i,
  'font/woff2': /\.(woff2)$/i,
  'image/jpeg': /\.(jpg|jpeg)$/i,
  'image/gif': /\.(gif)$/i,
  'image/png': /\.(png)$/i,
  'image/tiff': /\.(tif|tiff)$/i,
  'image/bmp': /\.(bmp)$/i,
  'image/ico': /\.(ico)$/i,
  'image/svg+xml': /\.(svg)$/i,
  'text/plain; charset=utf-8': /\.(txt)$/i,
  'text/css; charset=utf-8': /\.(css)$/i,
  'text/javascript; charset=utf-8': /\.(js)$/i,
  'application/json; charset=utf-8': /\.(json)$/i
};

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

  response.set('Content-Type', getContentType(request.url));
  response.set('Tanam-Created', new Date().toUTCString());
  response.set('Cache-Control', cache.getCacheHeader());
  response.send(fileContent);
}

async function handlePageRequest(request: express.Request, response: express.Response) {
  const requestUrl = url.parse(request.url).pathname;
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

  const contentDoc = documents[0];
  const pageHtml = await render.renderDocument(contentDoc);

  response.set('Tanam-Created', new Date().toUTCString());
  response.set('Tanam-Id', contentDoc.ref.path);
  response.set('Cache-Control', cache.getCacheHeader());

  const primaryDomain = await site.getPrimaryDomain();
  if (primaryDomain !== request.hostname) {
    console.log(`[handlePageRequest] Request is on secondary domain '${request.hostname}'. Adding canonical link to: ${primaryDomain}`);
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
  response.set('Content-Type', getContentType(requestUrl));
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
  const requestUrl = url.parse(request.url).pathname;
  console.log(`[handleRequest] ${request.method.toUpperCase()} ${request.hostname}${requestUrl}`);

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
