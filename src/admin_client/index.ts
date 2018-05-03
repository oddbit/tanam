import * as functions from "firebase-functions";
import * as express from 'express';
import * as path from 'path';
const app = express();

const adminPage = __dirname + '/public/';

app.use('/admin/static', express.static(adminPage + 'static/'));
app.get('/admin', (req, res) => {
  res.status(200).sendFile(adminPage + 'index.html');
});

export const adminClient = functions.https.onRequest(app);
