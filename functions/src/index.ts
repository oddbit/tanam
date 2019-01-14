import * as functions from 'firebase-functions';

export const tanam = functions.https.onRequest((request, response) => {
  require(`${process.cwd()}/dist/tanam-webpack/server`).app(request, response);
});
