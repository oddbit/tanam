import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as express from 'express';
import * as path from 'path';
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
  const adminClientDir = path.join(__dirname, 'admin_client');
  const appConfig = { ...tanamDefaultAppConfig, ...(tanamConfig || {}) };

  admin.firestore().settings({ timestampsInSnapshots: true });

  app.use(`/${appConfig.adminUrl}/public`, express.static(path.join(adminClientDir, 'public')));
  app.use(`/${appConfig.adminUrl}/**`, (req: express.Request, res: express.Response) => {
    const indexFileName = path.join(adminClientDir, '/index.html');
    const compiledHtml = handlers.handleAdminPage(indexFileName, tanamConfig.firebaseConfig);
    res.send(compiledHtml);
  });
  app.get('/manifest.json', handlers.handleWebManifestReq);
  app.get('/robots.txt', handlers.handleRobotsReq);
  app.get('/sitemap.xml', handlers.handleSitemapReq);
  app.get('**', handlers.handleRequest);
}