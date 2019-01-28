import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';

export interface TanamConfig {
  firebaseApp: any;
  loginProviders?: string[];
}
@Injectable({
  providedIn: 'root',
})
export class AppConfigService {
  private _appConfig: TanamConfig;

  constructor(
    private readonly http: HttpClient,
    @Optional() @Inject('TanamConfig') readonly tanamConfig: any, // TODO change me into TanamConfig
  ) {
    // Will be injected if served with SSR configuration
    this._appConfig = tanamConfig;
  }

  get appConfig() {
    return this._appConfig;
  }

  async loadConfig() {
    if (!!this._appConfig) {
      return this._appConfig;
    }

    console.log('Requesting app config async from assets.');
    const config = await this.http.get('/assets/tanam.config.json').toPromise();
    console.log(`[AppConfigService:loadConfig] ${JSON.stringify(config, null, 2)}`);
    this._appConfig = config as TanamConfig;
    return this._appConfig;
  }
}
