import * as firebase from 'firebase-admin';
import * as express from 'express';
import TanamConfig from './config';
import * as Vue from 'vue';
import * as VueServerRenderer from 'vue-server-renderer';
import * as utils from './utils/routing';

export class App {
  public app: express.Application;

  constructor(tanamConfig: TanamConfig = {}) {
    this.app = express();

    const adminUrl = tanamConfig.adminUrl || 'admin';
    this.app.use(`/${adminUrl}/`, express.static('./admin_client'));
    this.app.use(`/${adminUrl}/**`, (req: express.Request, res: express.Response) => {
      res.status(200).sendFile('index.html', { root: './admin_client' });
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

    // The document route is a base64 encoded version of the URL (to comply with Firebase key constraints)
    // It maps to a Firestore document reference of the content document that we want to render
    const documentRoute = await firebase.database()
      .ref('routes')
      .child(utils.encodePath(request.url))
      .once('value');

      if (!documentRoute.exists()) {
      response.status(404).send('Not found.');
      return;
    }

    // This is the corresponding Firestore document that is mapped by the URL
    const firestoreDoc = await firebase.firestore().doc(documentRoute.val()).get();
    if (!firestoreDoc.exists) {
      response.status(404).send('Not found.');
      console.error(`Database inconsistency! Path '${request.url}' pointed to non-existing document: ${documentRoute.val()}`);
      return documentRoute.ref.remove();
    }

    // Fetch the name of the theme. Template files are located under the theme name in cloud storage
    const siteTheme = (await firebase.database().ref('site/settings/theme').once('value')).val() || 'default';

    // The data of the document contains meta data such as what template to use fo rendering etc
    const contentPost = firestoreDoc.data();

    // The content post has a corresponding template file in the theme folder. This makes it possible to display
    // 'blog' posts differently from 'event' posts etc
    const contentPostTemlateFile = firebase.storage().bucket().file(`/themes/${siteTheme}/${contentPost.template}.tmpl.html`);
    const contentPostTemplateHtml = (await contentPostTemlateFile.exists())
      ? (await contentPostTemlateFile.download())[0].toString('utf8')
      : '<div>This is default template for {{ title }}</div>';

    // The master template contains the header, footer and everything that wraps the content type
    const masterTemplateFile = firebase.storage().bucket().file(`/themes/${siteTheme}/master.tmpl.html`);
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


    // Everything below here is just taken out of the example on VUE SSR documentation page
    // https://vuejs.org/v2/guide/ssr.html
    const app = new Vue.default({
      data: contentPost.data,
      template: masterTemplateHtml
    });

    renderer.renderToString(app, context, (err, html) => {
      if (err) {
        response.status(500).end('Internal Server Error');
        return;
      }
      response
        // Set this header so that we can inspect and verify whether we got a cached document or not.
        .set('Tanam-Created', new Date().toUTCString())

        // Use this for ability to link back to which document that was actually rendered
        .set('Tanam-Document', firestoreDoc.ref.toString())

        // We can cache the document for indefinite time. Because we manually purge cache on all document changes
        // via cloud function triggers
        .set('Cache-Control', `public, max-age=600, s-maxage=${60 * 60 * 24 * 365}`)
        .end(html);
    });
  }
}
