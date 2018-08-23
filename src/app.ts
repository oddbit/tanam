import * as admin from 'firebase-admin';
import * as express from 'express';
import * as handlers from './handlers';

if (admin.apps.length === 0) {
  admin.initializeApp();
}

export interface TanamConfig {
  adminUrl?: string;
  firebaseConfig?: any;
}

const tanamDefaultAppConfig: TanamConfig = {
  adminUrl: 'admin'
};

export const app = express();
export function initializeApp(tanamConfig: TanamConfig = {}) {
  const appConfig = { ...tanamDefaultAppConfig, ...(tanamConfig || {}) };

  app.get('/manifest.json', handlers.handleWebManifestReq);
  app.get('/robots.txt', handlers.handleRobotsReq);
  app.get('/sitemap.xml', handlers.handleSitemapReq);
  app.get('**', handlers.handleRequest);
}