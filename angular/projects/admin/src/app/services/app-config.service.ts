import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

interface FirebaseWebConfig {
  projectId: string;
  appId: string;
  databaseURL: string;
  storageBucket: string;
  locationId: string;
  apiKey: string;
  authDomain: string;
  messagingSenderId: string;
}

@Injectable({
  providedIn: 'root',
})
export class AppConfigService {
  private static readonly CONFIG_FILE = '/_/assets/firebase.web.json';
  private _firebaseConfig: FirebaseWebConfig;

  constructor(
    private readonly http: HttpClient,
  ) {
  }

  get firebaseConfig() {
    return this._firebaseConfig;
  }

  get siteId() {
    return this._firebaseConfig.projectId;
  }

  async loadConfig() {
    console.log('Requesting app config async from assets.');
    const config = await this.http.get(AppConfigService.CONFIG_FILE).toPromise();
    this._firebaseConfig = config as FirebaseWebConfig;

    if (!config) {
      throw new Error(`No config found at: ${AppConfigService.CONFIG_FILE}`);
    }

    const mandatoryFields = [
      'apiKey',
      'authDomain',
      'databaseURL',
      'projectId',
      'storageBucket',
      'messagingSenderId',
      'appId',
    ];
    const missingFields = mandatoryFields
      .filter(prop => !this._firebaseConfig.hasOwnProperty(prop));

    if (missingFields.length > 0) {
      throw new Error(`Missing mandatory configuration fields ${JSON.stringify(missingFields)}`);
    }
  }
}
