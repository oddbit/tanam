import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { SiteInformation, SiteTheme } from 'tanam-models';
import { AppConfigService } from '../../../../admin/src/app/services/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  readonly siteCollection = this.firestore.collection('tanam').doc<SiteInformation>(this.appConfig.siteId);

  constructor(
    private readonly firestore: AngularFirestore,
    private readonly appConfig: AppConfigService,
  ) { }

  getCurrentTheme(): Observable<SiteTheme> {
    return this.siteCollection
      .valueChanges()
      .pipe(switchMap(siteInfo =>
        this.siteCollection
          .collection('themes').doc<SiteTheme>(siteInfo.theme)
          .valueChanges()));
  }
}
