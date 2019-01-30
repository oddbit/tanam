import { HttpClient } from '@angular/common/http';
import { Injectable, Optional, Inject } from '@angular/core';
import { TanamConfig } from 'tanam-core';

@Injectable({
  providedIn: 'root',
})
export class AppConfigService {
  private static readonly CONFIG_FILE = '/assets/tanam.config.json';
  private _appConfig: TanamConfig;

  constructor(
    @Optional() @Inject('TanamRuntimeConfig') readonly tanamConfig: TanamConfig,
    private readonly http: HttpClient,
  ) {
    console.log(`Injecting runtime config: ${JSON.stringify(tanamConfig, null, 2)}`);
    this._appConfig = tanamConfig;
  }

  get appConfig() {
    return this._appConfig;
  }

  async loadConfig() {
    if (!!this._appConfig) {
      return;
    }

    console.log('Requesting app config async from assets.');
    const config = await this.http.get(AppConfigService.CONFIG_FILE).toPromise();
    this._appConfig = config as TanamConfig;

    if (!config) {
      throw new Error(`No config found at: ${AppConfigService.CONFIG_FILE}`);
    }

    this._ensureMandatoryFields(this._appConfig, ['firebaseApp']);
    this._ensureMandatoryFields(this._appConfig.firebaseApp, [
      'apiKey',
      'authDomain',
      'databaseURL',
      'projectId',
      'storageBucket',
      'messagingSenderId',
    ]);
  }


  private _ensureMandatoryFields(conf: any, fields: string[]) {
    const missingFields = fields.filter(prop => !conf.hasOwnProperty(prop));
    if (missingFields.length > 0) {
      throw new Error(`Missing mandatory configuration fields ${JSON.stringify(missingFields)}`);
    }
  }
}
