import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as express from 'express';
import * as handlers from './handlers';
import * as cache from './utils/cache';

export interface TanamConfig {
  adminUrl?: string;
}
const defaultConfig: TanamConfig = {
  adminUrl: 'admin'
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

  app.get('/manifest.json', handlers.handleWebManifestReq);
  app.get('**', handlers.handleRequest);
}

