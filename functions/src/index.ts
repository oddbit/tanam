
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { join } from 'path';
import {MD5} from 'crypto-js';

const expressServer = require(`./dynamic`);

admin.initializeApp();
admin.firestore().settings({ timestampsInSnapshots: true });

export * from './triggers/cache';
export * from './triggers/entries';
export * from './triggers/site';
export * from './triggers/users';


export const app = functions.https.onRequest((req, res) => {
    admin.database().ref('tanam/known_hosts').child(MD5(req.hostname).toString()).set(req.hostname);

    const isAdminAppRequest = !!req.url.match(/^\/?_.*$/i);
    console.log(`GET ${req.url}`);

    if (isAdminAppRequest) {
        const cacheControl = 'public, max-age=600, s-maxage=300, stale-while-revalidate=120';
        console.log(`Cache ${req.url}: ${cacheControl}`);
        res.setHeader('Cache-Control', cacheControl);
        res.sendFile(join(process.cwd(), 'browser/admin.html'));
    } else {
        const FIREBASE_FN_CONFIG = functions.config().app;
        const TANAM_CONFIG = {
            firebaseApp: {
                apiKey: process.env.FIREBASE_API_KEY || FIREBASE_FN_CONFIG.apikey,
                authDomain: process.env.FIREBASE_AUTH_DOMAIN || FIREBASE_FN_CONFIG.authdomain,
                databaseURL: process.env.FIREBASE_DB_URL || FIREBASE_FN_CONFIG.databaseurl,
                projectId: process.env.PROJECT_ID || FIREBASE_FN_CONFIG.projectid,
                storageBucket: process.env.FIREBASE_STORAGE_BUCKET || FIREBASE_FN_CONFIG.storagebucket,
                messagingSenderId: process.env.FIREBASE_SENDER_ID || FIREBASE_FN_CONFIG.messagingsenderid,
            },
        };

        console.log(JSON.stringify({ FIREBASE_WEB_CONFIG: TANAM_CONFIG }, null, 2));
        expressServer.initializeApp(TANAM_CONFIG);
        expressServer.app(req, res);
    }
});
