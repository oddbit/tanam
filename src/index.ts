import * as firebase from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as url from 'url';
import * as express from 'express';
import * as routing from './utils/routing';
import * as render from './utils/render';

const app = express();

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
  app.get('**', handleThemeRequest);
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

async function handleThemeRequest(request: express.Request, response: express.Response) {
  // The document route is a base64 encoded version of the URL (to comply with Firebase key constraints)
  // It maps to a Firestore document reference of the content document that we want to render
  const documentRoute = await firebase.database()
    .ref('routes')
    .child(routing.encodeRoutingTablePath(url.parse(request.url).pathname))
    .once('value');

  if (!documentRoute.exists()) {
    response.status(404).send('Not found.');
    return;
  }

  // This is the corresponding Firestore document that is mapped by the URL
  const firestoreDoc = await firebase.firestore().doc(documentRoute.val()).get();
  if (!firestoreDoc.exists) {
    response.status(404).send('Not found.');
    console.error(`Database inconsistency! Path '${request.url}' pointed to non-existing document: ${documentRoute.val()}`);
    return documentRoute.ref.remove();
  }

  const templateData = await render.buildTemplateData(firestoreDoc);
  const pageHtml = await render.renderPage(templateData);

  // Set this header so that we can inspect and verify whether we got a cached document or not.
  response.set('Tanam-Created', new Date().toUTCString());

  // Use this for ability to link back to which document that was actually rendered
  response.set('Tanam-Id', templateData.contextMeta.docRef);

  // We can cache the document for indefinite time. Because we manually purge cache on all document changes
  // via cloud function triggers
  const serverCache = functions.config().cache.serverAge || 60 * 60 * 24 * 365;
  const clientCache = functions.config().cache.clientAge || 600;
  console.log(`Setting cache options: clientAge=${clientCache}, serverAge=${serverCache}`);
  response.set('Cache-Control', `public, max-age=${clientCache}, s-maxage=${serverCache}`);
  response.end(pageHtml);
}