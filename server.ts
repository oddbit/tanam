// These are important and needed before anything else
import 'reflect-metadata';
import 'zone.js/dist/zone-node';

// Below here is ok to import in any order.
import { enableProdMode } from '@angular/core';
import { ngExpressEngine } from '@nguniversal/express-engine';
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';
import * as express from 'express';
import { readFileSync } from 'fs';
import { join } from 'path';
import { TanamConfig } from './src/app/services/app-config.service';

// Required for Firebase
(global as any).WebSocket = require('ws');
(global as any).XMLHttpRequest = require('xhr2');

// Faster renders in prod mode
enableProdMode();

// Express server
export const app = express();

const DIST_FOLDER = join(process.cwd(), 'dist');

const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require(`./tanam/main`);

const appConfig = process.env.FIREBASE_CONFIG || {
    adminUrl: 'fromDI',
    firebaseApp: {
        apiKey: 'AIzaSyAgQPU7GskiBovZeBGzhwQtbC6gXuxie-U',
        authDomain: 'tanam-e8e7d.firebaseapp.com',
        databaseURL: 'https://tanam-e8e7d.firebaseio.com',
        projectId: 'tanam-e8e7d',
        storageBucket: 'tanam-e8e7d.appspot.com',
        messagingSenderId: '572947425338',
    },
};

console.log(`[initializeApp] ${JSON.stringify(appConfig, null, 2)}`);

app.engine('html', ngExpressEngine({
    bootstrap: AppServerModuleNgFactory,
    providers: [
        provideModuleMap(LAZY_MODULE_MAP),
        {
            provide: 'TanamConfig',
            useValue: appConfig,
        },
    ],
}));

app.set('view engine', 'html');
app.set('views', join(DIST_FOLDER, APP_NAME));

// Serve static files
app.get('*.*', express.static(join(DIST_FOLDER, APP_NAME)));

// All regular routes use the Universal engine
app.get('*', (req, res) => res.render(join(DIST_FOLDER, APP_NAME, 'index.html'), { req }));
