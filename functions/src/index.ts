import * as functions from 'firebase-functions';

const server = require(`./tanam-webpack/server`);

export interface TanamConfig {
    firebaseApp: any;
}

export function initializeApp(config: TanamConfig) {
    server.initializeApp(config);
}

export const tanam = functions.https.onRequest(server.app);
export * from './users';
