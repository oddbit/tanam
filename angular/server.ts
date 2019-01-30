import 'zone.js/dist/zone-node';

import { enableProdMode } from '@angular/core';
import { ngExpressEngine } from '@nguniversal/express-engine';
import { REQUEST, RESPONSE } from '@nguniversal/express-engine/tokens';
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';
import * as express from 'express';
import { join } from 'path';
import { TanamConfig } from 'tanam-core';


(global as any).WebSocket = require('ws');
(global as any).XMLHttpRequest = require('xhr2');

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('./dist/dynamic/server/main');

enableProdMode();

const DIST_FOLDER = join(process.cwd(), 'browser');

export const app = express();
app.set('view engine', 'html');
app.set('views', DIST_FOLDER);

export function initializeApp(config: TanamConfig) {
  app.get('/^\/?assets\/tanam\.config\.json$/i', (req, res) => {
    const cacheControl = 'public, max-age=300, s-maxage=300, stale-while-revalidate=120';
    res.setHeader('Cache-Control', cacheControl);
    res.json(config);
  });


  app.engine('html', (_: any, options: any, callback: any) =>
    ngExpressEngine({
      bootstrap: AppServerModuleNgFactory,
      providers: [
        provideModuleMap(LAZY_MODULE_MAP),
        {
          provide: 'TanamRuntimeConfig',
          useValue: config
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
}

// Match the Angular generated files with the unique hash
// Serve them with fairly long cache lifetime since they'll be unique for each deploy
app.get(/^\/?main|polyfills|runtime|styles|vendor\.[\w\d]{20}\.js|css\/?$/i,
  express.static(DIST_FOLDER, {
    setHeaders: (res, path) => {
      const cacheControl = 'public, max-age=300, s-maxage=300, stale-while-revalidate=120';
      console.log(`Cache ${path}: ${cacheControl}`);
      res.setHeader('Cache-Control', cacheControl);
    },
  })
);


// Match any file in the assets folder.
app.get(/^\/?assets\/(.*)\/?$/i,
  express.static(DIST_FOLDER, {
    setHeaders: (res, path) => {
      const cacheControl = 'public, max-age=300, s-maxage=300, stale-while-revalidate=120';
      console.log(`Cache ${path}: ${cacheControl}`);
      res.setHeader('Cache-Control', cacheControl);
    },
  })
);

app.get(/^\/?favicon\.ico$/i, (req, res) => {
  // TODO: Check if present in cloud storage. Else serve static asset.
  res.sendFile(join(process.cwd(), 'browser/favicon.ico'));
});

// Match anything else and render it with the universal rendering engine
app.get('*', (req, res) => {
  const cacheControl = 'public, max-age=300, s-maxage=30, stale-while-revalidate=120';
  console.log(`Cache ${req.url}: ${cacheControl}`);
  res.setHeader('Cache-Control', cacheControl);
  res.render('dynamic', { req });
});
