import * as functions from 'firebase-functions';
import * as tanam from 'tanam';

tanam.initializeApp();

export const tanam_app = functions.https.onRequest(tanam.app);
export const tanamOnDocWriteUpdateCache = functions.firestore.document(tanam.firebaseFunctionsDocPath).onWrite(tanam.onDocWriteUpdateCache);