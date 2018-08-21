import * as firebase from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as express from 'express';
import * as routing from './utils/routing';
import * as cache from './utils/cache';
import * as render from './template/render';

firebase.initializeApp();
const app = express();
firebase.firestore().settings({ timestampsInSnapshots: true });

export * from './cloud_functions';
export const tanam = functions.https.onRequest(app);
export interface TanamConfig {
  adminUrl?: string;
}
export function initializeApp(tanamConfig: TanamConfig = {}) {
  const adminUrl = tanamConfig.adminUrl || 'admin';

  app.use(`/${adminUrl}/`, express.static('./admin_client'));
  app.use(`/${adminUrl}/**`, (req: express.Request, res: express.Response) => {
    res.status(200).sendFile('index.html', { root: './admin_client' });
  });

  app.get('/manifest.json', handleWebManifestReq);
  app.get('**', handlePageRequest);

}

async function handleWebManifestReq(request: express.Request, response: express.Response) {
  const webManifest = await firebase.database().ref('/config/manifest').once('value');

  if (!webManifest.exists()) {
    response.status(404).send('Not found.');
    return;
  }

  response
    .set('Tanam-Created', new Date().toUTCString())
    .set('Cache-Control', `public, max-age=600, s-maxage=${60 * 60}`)
    .json(webManifest.val());
}

async function handlePageRequest(request: express.Request, response: express.Response) {
  // This is the corresponding Firestore document that is mapped by the URL
  const documents = await routing.getFirestoreDocument(request.url);

  if (documents.length === 0) {
    response.status(404).end();
    return;
  }

  if (documents.length > 1) {
    response.status(500).send('Database inconsistency. URL is not uniquely resolved.').end();
    console.error(`URL '${request.url}' maps to ${documents.length} documents: ${JSON.stringify(documents.map(doc => doc.ref.path))}`);
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
  response.end(pageHtml);
}