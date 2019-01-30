import { Injectable, Optional, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TanamConfig } from 'tanam-core';

@Injectable({
  providedIn: 'root'
})
export class TanamConfigService {
  private static readonly CONFIG_FILE = '/assets/tanam.config.json';
  _tanamConfig: TanamConfig;

  constructor(
    @Optional() @Inject('TANAM_CONFIG') readonly tanamConfig: any,
    private readonly http: HttpClient,
  ) {
    console.log(`[TanamConfigService:constructor] injected config: ${JSON.stringify(tanamConfig, null, 2)}`);
    this._tanamConfig = tanamConfig || null;
  }

  get firebaseWebConfig() {
    return this._tanamConfig && this._tanamConfig.firebaseApp || null;
  }

  async loadConfig() {
    if (!!this._tanamConfig) {
      console.log(`[TanamConfigService:loadConfig] Config already loaded.`);
      return;
    }

    console.log(`[TanamConfigService:getFirebaseWebConfig] Fetching ${TanamConfigService.CONFIG_FILE}`);
    this._tanamConfig = (await this.http.get(TanamConfigService.CONFIG_FILE).toPromise()) as TanamConfig;
    console.log(`[TanamConfigService:getFirebaseWebConfig] ${JSON.stringify(this._tanamConfig, null, 2)}`);
  }
}
