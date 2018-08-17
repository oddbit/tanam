import * as firebase from 'firebase-admin';
import * as express from 'express';
import TanamConfig, { BaseConfig } from './config';
import * as Vue from 'vue';
import * as VueServerRenderer from 'vue-server-renderer';
import * as utils from './util';

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

    if (!pwaManifest.exists()) {
      response.status(404).send('Not found.');
      return;
    }

    response.set('Tanam-Created', new Date().toUTCString())
      .set('Content-Type', 'application/json')
      .set('Cache-Control', `public, max-age=600, s-maxage=${60 * 60}`)
      .send(pwaManifest.val());
  }

  async handleThemeRequest(request: express.Request, response: express.Response) {
    const renderer = VueServerRenderer.createRenderer();

    const documentRoute = await firebase.database().ref(encodePath(request.url)).once('value');
    if (!documentRoute.exists()) {
      response.status(404).send('Not found.');
      return;
    }

    const firestoreDoc = await firebase.firestore().doc(documentRoute.val()).get();
    if (!firestoreDoc.exists) {
      response.status(404).send('Not found.');
      console.error(`Database inconsistency! Path '${request.url}' pointed to non-existing document: ${documentRoute.val()}`);
      return documentRoute.ref.remove();
    }


    const contentPost = firestoreDoc.data();

    const contentPostFile = firebase.storage().bucket().file(`/themes/default/${contentPost.template}.tmpl.html`);
    const contentPostTemplateHtml = (await contentPostFile.exists())
      ? (await contentPostFile.download())[0].toString('utf8')
      : '<div>This is default template for {{ title }}</div>';

    const masterTemplateFile = firebase.storage().bucket().file('/themes/default/master.tmpl.html');
    const masterTemplateHtml = (await masterTemplateFile.exists())
      ? (await masterTemplateFile.download())[0].toString('utf8')
      : `
      <!DOCTYPE html>

      <html lang="en">
        <head>
        <title>${firestoreDoc.id}</title></head>
        <body>${contentPostTemplateHtml}</body>
      </html>
    `;

    const app = new Vue.default({
      data: contentPost.data,
      template: masterTemplateHtml
    });

    // Cache will be purged by cloud function every time a content document is updated
    renderer.renderToString(app, context, (err, html) => {
      if (err) {
        response.status(500).end('Internal Server Error');
        return;
      }
      response
        .set('Tanam-Created', new Date().toUTCString())
        .set('Cache-Control', `public, max-age=600, s-maxage=${60 * 60 * 24 * 365}`)
        .end(html);
    });
  }
}
