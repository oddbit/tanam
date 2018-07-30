import * as functions from 'firebase-functions';
import * as express from 'express';
import { Nuxt } from 'nuxt';

const themeDir = './node_modules/tanam/dist/theme';
const adminDir = './node_modules/tanam/dist/admin_client';

const config = {
  dev: false,
  buildDir: themeDir,
  build: {
    publicPath: '/assets/'
  }
};

const nuxt = new Nuxt(config);

const handleThemeRequest = (req, res) => {
  res.set('Cache-Control', 'public, max-age=600, s-maxage=1200');
  return nuxt.render(req, res);
}

const adminPage = adminDir + '/';

const app = express();

app.use('/admin/', express.static(adminPage));
app.use('/admin/**', (req, res) => {
  res.status(200).sendFile('index.html', { root: adminPage });
});

app.get('**', handleThemeRequest);

export const theme = functions.https.onRequest(app);