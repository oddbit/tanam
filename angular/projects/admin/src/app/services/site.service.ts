import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { SiteInformation } from 'tanam-models';
import { AppConfigService } from './app-config.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SiteService {
  private readonly projectId = this.firestore.firestore.app.options['projectId'];
  readonly siteCollection = this.firestore.collection('tanam').doc<SiteInformation>(this.appConfig.siteId);

  constructor(
    private readonly firestore: AngularFirestore,
    private readonly appConfig: AppConfigService,
  ) { }

  getSiteInfo(): Observable<SiteInformation> {
    return this.firestore.collection('tanam').doc<SiteInformation>(this.appConfig.siteId).valueChanges();
  }

  getSiteName(): Observable<string> {
    return this.getSiteInfo().pipe(map(settings => settings.title));
  }

  getTheme(): Observable<string> {
    return this.getSiteInfo().pipe(map(settings => settings.theme));
  }

  getPrimaryDomain(): Observable<string> {
    return this.getSiteInfo().pipe(map(settings => settings.primaryDomain));
  }

  save(settings: SiteInformation) {
    console.log(`[SettingsDomainComponent:saveSiteSettings] ${JSON.stringify(settings, null, 2)}`);

    settings.domains = settings.domains.filter(domain => domain.indexOf('.firebaseapp.com') === -1);
    settings.domains.splice(0, 0, `${this.projectId}.firebaseapp.com`);

    // Custom domain is flagged if the primary domain isn't the default hosting
    if (settings.primaryDomain) {
      settings.isCustomDomain = settings.primaryDomain.indexOf('.firebaseapp.com') === -1 ||
                                settings.primaryDomain.indexOf('.web.app') === -1;
    }


    return this.firestore.collection('tanam').doc(this.appConfig.siteId).update(settings);
  }
}
