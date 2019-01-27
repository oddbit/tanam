import 'zone.js/dist/zone-node';

import { enableProdMode } from '@angular/core';
import { ngExpressEngine } from '@nguniversal/express-engine';
import { REQUEST, RESPONSE } from '@nguniversal/express-engine/tokens';
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';
import * as express from 'express';
import { join } from 'path';
import { environment } from './src/environments/environment';


(global as any).WebSocket = require('ws');
(global as any).XMLHttpRequest = require('xhr2');

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

// Express server
const app = express();

const PORT = process.env.PORT || 4000;
const DIST_FOLDER = join(process.cwd(), 'dist/browser');

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('./dist/server/main');
// if (!process.env.FIREBASE_API_KEY) {
//   require('dotenv').config();
//   console.log('Loaded env conf');
//   Object.keys(process.env).filter(k => k.startsWith('FIREBASE')).forEach(console.log);
// }

const tanamConfig = !process.env.FIREBASE_API_KEY
  ? require('./tanam.config.json')
  : {
    firebaseApp: {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      databaseURL: process.env.FIREBASE_DB_URL,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_SENDER_ID,
    },
  };

console.log(`Tanam Config: ${JSON.stringify(tanamConfig, null, 2)}`);

app.engine('html', (_: any, options: any, callback: any) =>
  ngExpressEngine({
    bootstrap: AppServerModuleNgFactory,
    providers: [
      provideModuleMap(LAZY_MODULE_MAP),
      {
        provide: 'TanamConfig',
        useValue: tanamConfig,
      },
      {
        provide: REQUEST,
        useValue: options.req,
      },
      {
        provide: RESPONSE,
        useValue: options.req.res,
      },
    ],
  })(_, options, callback)
);

app.set('view engine', 'html');
app.set('views', DIST_FOLDER);

// Match the Angular generated files with the unique hash
// Serve them with fairly long cache lifetime since they'll be unique for each deploy
app.get(/^\/?main|polyfills|runtime|styles|vendor\.[\w\d]{20}\.js|css\/?$/i,
  express.static(DIST_FOLDER, {
    setHeaders: (res, path) => {
      const cacheControl = 'public, max-age=300, s-maxage=300, stale-while-revalidate=120';
      if (environment.logging.cache) {
        console.log(`Cache ${path}: ${cacheControl}`);
      }
      res.setHeader('Cache-Control', cacheControl);
    },
  }));

app.get(/^\/?favicon\.ico$/i, express.static(DIST_FOLDER));
app.get(/^\/?assets\/tanam\.config\.json$/i, express.static(DIST_FOLDER));

// Match any file in the assets folder.
app.get(/^\/?assets\/(.*)\/?$/i,
  express.static(DIST_FOLDER, {
    setHeaders: (res, path) => {
      const cacheControl = 'public, max-age=300, s-maxage=300, stale-while-revalidate=120';
      if (environment.logging.cache) {
        console.log(`Cache ${path}: ${cacheControl}`);
      }
      res.setHeader('Cache-Control', cacheControl);
    },
  }));


// Match anything else and render it with the universal rendering engine
app.get('*', (req, res) => {
  res.set('Cache-Control', `public, max-age=5, s-maxage=5, stale-while-revalidate=120`);
  res.render('index', { req });
});
// Start up the Node server
app.listen(PORT, () => {
  console.log(`Node Express server listening on http://localhost:${PORT}`);
});
