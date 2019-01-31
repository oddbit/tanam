import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SiteDomainSettings, SiteInfoSettings } from '../models/settings.models';


@Injectable({
  providedIn: 'root'
})
export class SiteSettingsService {
  private readonly projectId = this.firestore.firestore.app.options['projectId'];

  private readonly settingsCollection = this.firestore.collection('tanam-settings');
  private readonly siteInfoSettingsDoc = this.settingsCollection.doc<SiteInfoSettings>('site');
  private readonly domainSettingsDoc = this.settingsCollection.doc<SiteDomainSettings>('domain');

  constructor(
    private readonly fbApp: FirebaseApp,
    private readonly firestore: AngularFirestore,
  ) { }

  getSiteSettings(): Observable<SiteInfoSettings> {
    return this.siteInfoSettingsDoc.valueChanges();
  }

  getSiteName(): Observable<string> {
    return this.getSiteSettings().pipe(map(settings => settings.title));
  }

  getSiteTheme(): Observable<string> {
    return this.getSiteSettings().pipe(map(settings => settings.theme));
  }

  getSiteTitleFormat(): Observable<string> {
    return this.getSiteSettings().pipe(map(settings => settings.pageTitleFormat));
  }

  saveSiteSettings(settings: SiteInfoSettings) {
    console.log(`[SettingsDomainComponent:saveSiteSettings] ${JSON.stringify(settings, null, 2)}`);
    return this.fbApp.firestore().runTransaction<void>(async (trx) => {
      trx.update(this.siteInfoSettingsDoc.ref, settings);
    });
  }

  getDomainSettings(): Observable<SiteDomainSettings> {
    return this.domainSettingsDoc.valueChanges();
  }

  saveDomainSettings(settings: SiteDomainSettings) {
    // Remove any occurance of .firebaseapp.com domain and manually put the
    // project's default Firebase hosting domain as the first element
    settings.domains = settings.domains
      .filter(domain => domain.indexOf('.firebaseapp.com') === -1);
    settings.domains.splice(0, 0, `${this.projectId}.firebaseapp.com`);

    // Custom domain is flagged if the primary domain isn't the default hosting
    if (settings.primaryDomain) {
      settings.isCustomDomain = settings.primaryDomain.indexOf('.firebaseapp.com') === -1;
    }

    console.log(`[SettingsDomainComponent:saveDomainSettings] ${JSON.stringify(settings, null, 2)}`);
    return this.fbApp.firestore().runTransaction<void>(async (trx) => {
      trx.update(this.domainSettingsDoc.ref, settings);
    });
  }

  getSiteDomain(): Observable<string> {
    return this.getDomainSettings().pipe(map(settings => settings.primaryDomain));
  }
}
