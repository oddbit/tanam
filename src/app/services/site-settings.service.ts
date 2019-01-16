import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';
import { SiteSettings } from '../admin/settings-site/settings-site.component';

export const StringTemplates = {
  siteName: 'site_name',
  pageTitle: 'page_title',
};

const SettingsDocumentKeys = {
  domain: 'domain',
  site: 'site',
  admin: 'admin',
};

export interface DomainSettings {
  isCustomDomain: boolean;
  primaryDomain: string;
  domains: string[];
}

export interface AdminSettings {
  theme: string;
  language: string;
}

@Injectable({
  providedIn: 'root'
})
export class SiteSettingsService {

  constructor(
    private readonly firestore: AngularFirestore,
  ) { }

  getSiteName() {
    return this.firestore
      .collection('tanam-settings').doc<SiteSettings>(SettingsDocumentKeys.site)
      .valueChanges()
      .pipe(map(settings => settings.title));
  }

  getSiteTitleFormat() {
    return of(`${StringTemplates.siteName} | ${StringTemplates.pageTitle}`);
  }

  getSiteDomain() {
    return this.firestore
      .collection('tanam-settings').doc<DomainSettings>(SettingsDocumentKeys.domain)
      .valueChanges()
      .pipe(map(settings => settings.primaryDomain));
  }
}
