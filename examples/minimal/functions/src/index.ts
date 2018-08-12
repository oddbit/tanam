import * as functions from 'firebase-functions';
import * as Tanam from 'tanam';

const mainApp = new Tanam.App().app;

export const serve = functions.https.onRequest(mainApp);