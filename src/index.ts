import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as express from 'express';
import * as routing from './utils/routing';
import * as cache from './utils/cache';
import * as render from './template/render';

export interface TanamConfig {
  adminUrl?: string;
}
const defaultConfig: TanamConfig = {
  adminUrl: 'admin'
};

const CONTENT_IMAGE = 'image';
const CONTENT_TYPE_JS = 'text/javascript';
const CONTENT_TYPE_CSS = 'text/css';

const supportedContentTypes = {
  CONTENT_IMAGE: /\.(gif|jpg|jpeg|tiff|png)$/i,
  CONTENT_CSS: /\.(css)$/i,
  CONTENT_JS: /\.(js)$/i
};

const app = express();
export * from './cloud_functions';
export const tanam = functions.https.onRequest(app);
export function initializeApp(tanamConfig: TanamConfig = {}) {
  if (admin.apps.length === 0) {
    throw new Error('You must initialize Firebase Admin before Tanam.');
  }

  const appConfig = { ...defaultConfig, ...(tanamConfig || {}) };

  app.use(`/${appConfig.adminUrl}/`, express.static('./admin_client'));
  app.use(`/${appConfig.adminUrl}/**`, (req: express.Request, res: express.Response) => {
    res.status(200).sendFile('index.html', { root: './admin_client' });
  });

  app.get('/manifest.json', handleWebManifestReq);
  app.get('**', handleRequest);
}

function getContentType(url: string) {
  for (const contentType in supportedContentTypes) {
    if (supportedContentTypes[contentType]) {
      return contentType;
    }
  }
  return null;
}

function handleRequest(request: express.Request, response: express.Response) {
  console.log(`${request.method.toUpperCase()} ${request.url}`);
  const contentType = getContentType(request.url);

  try {
    if (contentType.startsWith('text')) {
      handleTextContentRequest(request, response, contentType);
    } else {
      handlePageRequest(request, response);
    }
  } catch (err) {
    response.status(err.code || 500).send(err.message);
  }
}

async function handleTextContentRequest(request: express.Request, response: express.Response, contentType: string) {
  const theme = await render.getSiteThemeName();
  const contentFile = admin.storage().bucket().file(`/themes/${theme}${request.url}`);
  const [contentExists] = await contentFile.exists();

  if (!contentExists) {
    console.log(`[HTTP 404] No content file file "${request.url}" in theme "${theme}"`);
    response.status(404).send(`Not found: ${request.url}`);
    return;
  }

  const [content] = await contentFile.download();
  console.log(`File size: ${content.byteLength} bytes`);

  // Set this header so that we can inspect and verify whether we got a cached document or not.
  response.set('Tanam-Created', new Date().toUTCString());
  response.set('Content-Type', `${contentType}; charset=utf-8`);
  response.set('Cache-Control', `public, max-age=600, s-maxage=${60 * 60}`);
  response.send(content.toString('utf8'));
}

async function handleWebManifestReq(request: express.Request, response: express.Response) {
  const webManifest = await admin.database().ref('web_manifest').once('value');

  if (!webManifest.exists()) {
    console.log(`[HTTP 404] No web manifest present`);
    response.status(404).send('Not found.');
    return;
  }

  // Set this header so that we can inspect and verify whether we got a cached document or not.
  response.set('Tanam-Created', new Date().toUTCString());
  response.set('Cache-Control', `public, max-age=600, s-maxage=${60 * 60}`);
  response.json(webManifest.val());
}

async function handlePageRequest(request: express.Request, response: express.Response) {
  // This is the corresponding Firestore document that is mapped by the URL
  const documents = await routing.getFirestoreDocument(request.url);

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

  const templateData = await render.buildTemplateData(documents[0]);
  const pageHtml = await render.renderPage(templateData);

  // Set this header so that we can inspect and verify whether we got a cached document or not.
  response.set('Tanam-Created', new Date().toUTCString());

  // Use this for ability to link back to which document that was actually rendered
  response.set('Tanam-Id', templateData.contextMeta.docRef);

  // We can cache the document for indefinite time. Because we manually purge cache on all document changes
  // via cloud function triggers
  const serverCache = cache.getServerCacheAge(functions.config());
  const clientCache = cache.getClientCacheAge(functions.config());
  console.log(`Setting cache options: clientAge=${clientCache}, serverAge=${serverCache}`);
  response.set('Cache-Control', `public, max-age=${clientCache}, s-maxage=${serverCache}`);
  response.send(pageHtml);
}
