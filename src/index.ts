import * as admin from 'firebase-admin';
import * as express from 'express';
import * as fs from 'fs';
import * as path from 'path';
import * as handlebars from 'handlebars';
import * as handlers from './handlers';

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const adminClientDir = path.join(__dirname, 'admin_client');

export * from './cache';
export const app = express();
export function initializeApp(tanamConfig: TanamConfig = {}) {
  const appConfig = { ...tanamDefaultAppConfig, ...(tanamConfig || {}) };

  injectFirebaseConfig(tanamConfig.firebaseConfig);

  app.use(`/${appConfig.adminUrl}/`, express.static(adminClientDir));
  app.use(`/${appConfig.adminUrl}/**`, (req: express.Request, res: express.Response) => {
    res.status(200).sendFile('index.html', { root: adminClientDir });
  });

  app.get('/manifest.json', handlers.handleWebManifestReq);
  app.get('**', handlers.handleRequest);
}

export interface TanamConfig {
  adminUrl?: string;
  firebaseConfig?: any;
}

const tanamDefaultAppConfig: TanamConfig = {
  adminUrl: 'admin'
};

function injectFirebaseConfig(firebaseConfig) {
  const indexFileName = path.join(adminClientDir, '/index.html');
  const indexFile = fs.readFileSync(indexFileName, 'utf8');
  firebaseConfig['stringify'] = JSON.stringify(firebaseConfig);
  const compiledHtml = handlebars.compile(indexFile)({ fbConfig: firebaseConfig });
  fs.writeFileSync(indexFileName, compiledHtml);
}