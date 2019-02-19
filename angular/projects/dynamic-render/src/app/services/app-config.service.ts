import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';
import { TanamConfig } from 'tanam-models';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  private static readonly CONFIG_FILE = '/assets/tanam.config.json';
  private _tanamConfig: TanamConfig;

  constructor(
    @Optional() @Inject('TANAM_CONFIG') readonly tanamConfig: any,
    private readonly http: HttpClient,
  ) {
    console.log(`[AppConfigService:constructor] injected config: ${JSON.stringify(tanamConfig, null, 2)}`);
    this._tanamConfig = tanamConfig || null;
  }

  get siteId() {
    return this._tanamConfig.firebaseApp.projectId;
  }

  get firebaseWebConfig() {
    return this._tanamConfig && this._tanamConfig.firebaseApp || null;
  }

  async loadConfig() {
    if (this._isConfigValid) {
      console.log(`[AppConfigService:loadConfig] Config already loaded.`);
      return;
    }

    console.log(`[AppConfigService:getFirebaseWebConfig] Fetching ${AppConfigService.CONFIG_FILE}`);
    this._tanamConfig = (await this.http.get(AppConfigService.CONFIG_FILE).toPromise()) as TanamConfig;
    console.log(`[AppConfigService:getFirebaseWebConfig] ${JSON.stringify(this._tanamConfig, null, 2)}`);
  }

  private get _isConfigValid() {
    return !!this._tanamConfig && !!this._tanamConfig.firebaseApp;
  }
}
