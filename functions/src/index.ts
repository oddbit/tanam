
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { join } from 'path';

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
        const expressServer = require(`./dynamic`);
        console.log(`Express app: ${JSON.stringify(expressServer.app, null, 2)}`);
        expressServer.app(req, res);
    }
});
