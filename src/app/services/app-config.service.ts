import { Inject, Injectable, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface TanamConfig {
  firebaseApp: any;
  loginProviders?: string[];
}
@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  get appConfig() {
    return this._appConfig;
  }
  private _appConfig: TanamConfig;

  constructor(
    private readonly http: HttpClient,
    @Optional() @Inject('TanamConfig') readonly tanamConfig: any, // TODO change me into TanamConfig
  ) {
    // Will be injected if served with SSR configuration
    this._appConfig = tanamConfig || environment.tanamConfig;
  }

  loadConfig() {
    console.log(`[AppConfigService:loadConfig] ${JSON.stringify(this._appConfig, null, 2)}`);
    return this._appConfig;
  }
}
