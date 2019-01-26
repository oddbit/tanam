// Zone is required for Angular to work properly and *must* be imported first of all
import 'zone.js/dist/zone-node';

import { enableProdMode } from '@angular/core';
import { ngExpressEngine } from '@nguniversal/express-engine';
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import { join } from 'path';
import { environment } from './src/environments/environment';

// Required for Firebase
(global as any).WebSocket = require('ws');
(global as any).XMLHttpRequest = require('xhr2');

enableProdMode();

const DIST_FOLDER = __dirname;

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('./server/main');

const expressApp = express();

if (admin.apps.length === 0) {
    console.log('Initializing default Firebase app');
    admin.initializeApp();
}

export * from './firebase';
admin.firestore().settings({ timestampsInSnapshots: true });
export const app = functions.https.onRequest(expressApp);

if (!process.env.FIREBASE_API_KEY) {
    require('dotenv').config();
    console.log('Loaded env conf');
    console.log(JSON.stringify(process.env, null, 2));
}

const tanamConfig = {
    firebaseApp: {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        databaseURL: process.env.FIREBASE_DB_URL,
        projectId: process.env.PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_SENDER_ID,
    },
};

expressApp.engine('html', ngExpressEngine({
    bootstrap: AppServerModuleNgFactory,
    providers: [
        provideModuleMap(LAZY_MODULE_MAP),
        {
            provide: 'TanamConfig',
            useValue: tanamConfig,
        },
    ]
}));

expressApp.set('view engine', 'html');
expressApp.set('views', join(DIST_FOLDER, 'browser'));


// Match the Angular generated files with the unique hash
// Serve them with fairly long cache lifetime since they'll be unique for each deploy
expressApp.get(/^\/?main|polyfills|runtime|styles|vendor\.[\w\d]{20}\.js|css\/?$/i,
    express.static(join(DIST_FOLDER, 'browser'), {
        setHeaders: (res, path) => {
            const cacheControl = 'public, max-age=300, s-maxage=300, stale-while-revalidate=120';
            if (environment.logging.cache) {
                console.log(`Cache ${path}: ${cacheControl}`);
            }
            res.setHeader('Cache-Control', cacheControl);
        },
    }));

// Match any file in the assets folder.
expressApp.get(/^(\/)?assets\/(.*)\/?$/i,
    express.static(join(DIST_FOLDER, 'browser'), {
        setHeaders: (res, path) => {
            const cacheControl = 'public, max-age=300, s-maxage=300, stale-while-revalidate=120';
            if (environment.logging.cache) {
                console.log(`Cache ${path}: ${cacheControl}`);
            }
            res.setHeader('Cache-Control', cacheControl);
        },
    }));

// Match anything else and render it with the universal rendering engine
expressApp.get('**', (req, res) => {
    res.render('index', { req }, (err, html) => {
        console.log('*********************************************************************************');
        console.log('*********************************************************************************');
        console.log('*********************************************************************************');
        console.log(JSON.stringify(err, null, 2));
        console.log('*********************************************************************************');
        console.log('*********************************************************************************');
        console.log('*********************************************************************************');
        console.log(html);
        console.log('*********************************************************************************');
        console.log('*********************************************************************************');
        console.log('*********************************************************************************');

        res.set('Cache-Control', `public, max-age=300, s-maxage=300, stale-while-revalidate=120`);
        res.send(html);
    });
});
