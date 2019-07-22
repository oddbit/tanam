import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

admin.initializeApp();

// noinspection JSUnusedGlobalSymbols
export const heartbeat = functions.pubsub.schedule('every 1 minutes').onRun(() => {
  console.log('lub-dub');
  return null;
});

export * from './triggers';
