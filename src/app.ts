import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as express from 'express';
import * as handlers from './handlers';

export interface TanamConfig {
  adminUrl?: string;
  firebaseConfig?: any;
}

const tanamDefaultAppConfig: TanamConfig = {
  adminUrl: 'admin'
};

const app = express();
export const tanam = functions.https.onRequest(app);
export function initializeApp(tanamConfig: TanamConfig = {}) {
  const appConfig = { ...tanamDefaultAppConfig, ...(tanamConfig || {}) };

  admin.firestore().settings({ timestampsInSnapshots: true });

  app.use(`/${appConfig.adminUrl}/`, express.static('./admin_client'));
  app.use(`/${appConfig.adminUrl}/**`, (req: express.Request, res: express.Response) => {
    res.status(200).sendFile('index.html', { root: './admin_client' });
  });
  app.get('/manifest.json', handlers.handleWebManifestReq);
  app.get('/robots.txt', handlers.handleRobotsReq);
  app.get('/sitemap.xml', handlers.handleSitemapReq);
  app.get('**', handlers.handleRequest);
}