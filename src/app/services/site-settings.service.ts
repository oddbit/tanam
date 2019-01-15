import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

export const StringTemplates = {
  siteName: 'site_name',
  pageTitle: 'page_title',
};

export interface DomainSettings {
  isCustomDomain: boolean;
  primaryDomain: string;
  domains: string[];
}

@Injectable({
  providedIn: 'root'
})
export class SiteSettingsService {

  constructor(
    private readonly firestore: AngularFirestore,
  ) { }

  async getSiteName() {
    return 'MyTanam Site';
  }

  async getSiteTitleFormat() {
    return `${StringTemplates.siteName} | ${StringTemplates.pageTitle}`;
  }

  getSiteDomain() {
    return this.firestore
      .collection('tanam-settings').doc<DomainSettings>('domain')
      .valueChanges()
      .pipe(map(settings => settings.primaryDomain));
  }
}
