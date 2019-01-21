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

const DIST_FOLDER = process.env.FUNCTION_NAME ? __dirname : join(__dirname, 'dist');

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
expressApp.get('*.*', express.static(join(DIST_FOLDER, 'browser')));
expressApp.get('*', (req, res) => {
    // Render with universal engine
    res.render('index', { req });
});
