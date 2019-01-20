import * as functions from 'firebase-functions';

export const app = functions.https.onRequest((req, res) => {
    res.send('ok');
});
