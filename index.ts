// Zone is required for Angular to work properly and *must* be imported first of all
import 'zone.js/dist/zone-node';

import { enableProdMode } from '@angular/core';
import { ngExpressEngine } from '@nguniversal/express-engine';
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import { join } from 'path';

// Required for Firebase
(global as any).WebSocket = require('ws');
(global as any).XMLHttpRequest = require('xhr2');

enableProdMode();

const expressApp = express();

if (admin.apps.length === 0) {
    admin.initializeApp();
}

export const app = functions.https.onRequest(expressApp);
export * from './firebase/users';
export * from './firebase/cache';

const DIST_FOLDER = __dirname;

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('./server/main');

const appConfig = process.env.FIREBASE_CONFIG || {
    adminUrl: 'FROM HARD CODED',
    firebaseApp: {
        apiKey: 'AIzaSyAgQPU7GskiBovZeBGzhwQtbC6gXuxie-U',
        authDomain: 'tanam-e8e7d.firebaseapp.com',
        databaseURL: 'https://tanam-e8e7d.firebaseio.com',
        projectId: 'tanam-e8e7d',
        storageBucket: 'tanam-e8e7d.appspot.com',
        messagingSenderId: '572947425338',
    },
};

expressApp.engine('html', ngExpressEngine({
    bootstrap: AppServerModuleNgFactory,
    providers: [
        provideModuleMap(LAZY_MODULE_MAP),
        {
            provide: 'TanamConfig',
            useValue: appConfig,
        },
    ]
}));

expressApp.set('view engine', 'html');
expressApp.set('views', join(DIST_FOLDER, 'browser'));

// Cache the auto-generated scripts
expressApp.get(/^(\/)?main|polyfills|runtime|styles{1}\\.[\w\d]{20}\\.js|css{1}\/?$/i,
    express.static(join(DIST_FOLDER, 'browser'), {
        maxAge: '1d', // TODO: Set this one to very long time since it will be unique per deploy
    }));

expressApp.get(/^(\/)?assets\/(.*)\/?$/i,
    express.static(join(DIST_FOLDER, 'browser'), {
        maxAge: '12h',
    }));

expressApp.get('**', (req, res) => {
    // TODO: Make caching policy dynamic and user configurable
    console.log('In universal rendering.');
    const cacheControl = `public, max-age=300, s-maxage=300, stale-while-revalidate=120`;
    res.set('Cache-Control', cacheControl);
    // Render with universal engine
    res.render('index', { req });
});
