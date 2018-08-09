import * as express from 'express';
import { Nuxt } from 'nuxt';
import TanamConfig, { BaseConfig } from './config';

export class App {
  public app: express.Application;
  private nuxt: any;
  private _tanamConfig: TanamConfig;

  constructor(tanamConfig: BaseConfig = {}) {
    this._tanamConfig = new TanamConfig(tanamConfig);

    const { configuration, nuxtConfig } = this._tanamConfig;
    const { adminUrl, adminDir } = configuration;

    this.nuxt = new Nuxt(nuxtConfig);

    this.app = express();

    this.app.use(`/${adminUrl}/`, express.static(adminDir));
    this.app.use(`/${adminUrl}/**`, (req: express.Request, res: express.Response) => {
      res.status(200).sendFile('index.html', { root: adminDir });
    });

    this.app.get('**', this.handleThemeRequest.bind(this));
  }

  handleThemeRequest(req: express.Request, res: express.Response) {
    res.set('Cache-Control', 'public, max-age=600, s-maxage=1200');
    return this.nuxt.render(req, res);
  }
}
