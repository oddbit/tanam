
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { join } from 'path';

const expressServer = require(`./dynamic`);

admin.initializeApp();
admin.firestore().settings({ timestampsInSnapshots: true });

export * from './triggers/cache';
export * from './triggers/entries';
export * from './triggers/users';

export const app = functions.https.onRequest((req, res) => {
    const isAdminAppRequest = !!req.url.match(/^\/?_.*$/i);
    console.log(`GET ${req.url}`);

    if (isAdminAppRequest) {
        res.sendFile(join(process.cwd(), 'browser/admin.html'));
    } else {
        expressServer.app(req, res);
    }
});
