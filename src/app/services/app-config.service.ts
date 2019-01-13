import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  private _appConfig;

  constructor(private http: HttpClient) { }

  async loadAppConfig() {
    const data = await this.http.get('/assets/tanamConfig.json')
      .toPromise();
    console.log(`[AppConfigService:loadAppConfig] ${JSON.stringify(data)}`);
    this._appConfig = data;
    return data;
  }

  get appConfig() {
    return this._appConfig;
  }
}
