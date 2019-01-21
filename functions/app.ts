
import * as functions from 'firebase-functions';

export const app = functions.https.onRequest((request, response) => {
    console.log('*****************************************************************');
    const server = require(`./tanam-webpack/server`);
    if (!server) {
        throw new Error('Tanam was not properly configured. Make sure that the webpacked server is included.');
    }
    server.app(request, response);
});
