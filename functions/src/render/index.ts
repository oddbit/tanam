import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { MD5 } from 'crypto-js';
import { TanamConfig } from '../../../models';
import { renderAdmin } from './admin';

let TANAM_CONFIG = {} as TanamConfig;

// Leave it as a require since it will resolve the module location when executed in the `dist` folder
const expressServer = require(`../dynamic`) || require(`../dist/dynamic`);

export const initializeApp = (config: TanamConfig) => {
    TANAM_CONFIG = config;
    expressServer.initializeApp(config);
};

export const app = functions.https.onRequest((req, res) => {
    admin.database().ref('tanam')
        .child(process.env.GCLOUD_PROJECT)
        .child('domains')
        .child(MD5(req.hostname).toString())
        .set(req.hostname);

    const isAdminAppRequest = !!req.url.match(/^\/?_.*$/i);
    console.log(`GET ${req.url}`);

    if (isAdminAppRequest) {
        renderAdmin(res, req);
        return;
    }

    if (!TANAM_CONFIG.firebaseApp) {
        const FIREBASE_FN_CONFIG = functions.config().app || {};
        TANAM_CONFIG.firebaseApp = {
            apiKey: process.env.FIREBASE_API_KEY || FIREBASE_FN_CONFIG.apikey,
            authDomain: process.env.FIREBASE_AUTH_DOMAIN || FIREBASE_FN_CONFIG.authdomain,
            databaseURL: process.env.FIREBASE_DB_URL || FIREBASE_FN_CONFIG.databaseurl,
            projectId: process.env.PROJECT_ID || FIREBASE_FN_CONFIG.projectid || process.env.GCLOUD_PROJECT,
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET || FIREBASE_FN_CONFIG.storagebucket,
            messagingSenderId: process.env.FIREBASE_SENDER_ID || FIREBASE_FN_CONFIG.messagingsenderid,
        };

        console.log(JSON.stringify({ FIREBASE_WEB_CONFIG: TANAM_CONFIG }, null, 2));
        expressServer.initializeApp(TANAM_CONFIG);
    }

    expressServer.app(req, res);
});
