import * as firebase from 'firebase-admin';
import * as express from 'express';
import TanamConfig, { BaseConfig } from './config';
import * as Vue from 'vue';
import * as VueServerRenderer from 'vue-server-renderer';

export class App {
  public app: express.Application;
  private _tanamConfig: TanamConfig;

  constructor(tanamConfig: BaseConfig = {}) {
    this._tanamConfig = new TanamConfig(tanamConfig);

    const { configuration, nuxtConfig } = this._tanamConfig;
    const { adminUrl, adminDir } = configuration;

    this.app = express();

    this.app.use(`/${adminUrl}/`, express.static(adminDir));
    this.app.use(`/${adminUrl}/**`, (req: express.Request, res: express.Response) => {
      res.status(200).sendFile('index.html', { root: adminDir });
    });
    this.app.get('/manifest.json', this.handlePwaManifestReq.bind(this));
    this.app.get('**', this.handleThemeRequest.bind(this));
  }

  async handlePwaManifestReq(request: express.Request, response: express.Response) {
    const pwaManifest = await firebase.database().ref('/config/pwa').once('value');

    if (!pwaManifest) {
      response.status(404).send('Not found.');
      return;
    }

    response.set('Tanam-Created', new Date().toUTCString())
      .set('Content-Type', 'application/json')
      .set('Cache-Control', `public, max-age=600, s-maxage=${60 * 60}`)
      .send(pwaManifest.val());
  }

  async handleThemeRequest(req: express.Request, res: express.Response) {
    const renderer = VueServerRenderer.createRenderer();
    const queryResult = await firebase.firestore().collection('events').where('url', '==', req.url).get();

    if (queryResult.docs.length === 0) {
      res.status(404).send('Not found.');
      return;
    }

    if (queryResult.docs.length > 1) {
      res.status(500).send('URL is not uniquely mapped to a single document.');
      return;
    }

    const contentDoc = queryResult.docs[0].data();
    const [buffer] = await firebase.storage().bucket().file(contentDoc.templateFile).download();

    const app = new Vue.default({
      data: {
        url: req.url
      },
      template: buffer.toString('utf8')
    });

    // Cache will be purged by cloud function every time a content document is updated
    renderer.renderToString(app, context, (err, html) => {
      if (err) {
        res.status(500).end('Internal Server Error');
        return;
      }

      res.set('Cache-Control', `public, max-age=600, s-maxage=${60 * 60 * 24 * 365}`);
      res.end(`
      <!DOCTYPE html>
      <html lang="en">
        <head><title>Hello</title></head>
        <body>${html}</body>
      </html>
    `);
    });
  }
}
