import { Inject, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ITanamSite, TanamSite } from 'tanam-models';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, switchMap, tap, take } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';
import { AngularTanamSite } from '../app.models';
import { AppAuthService } from './app-auth.service';
import { fromPromise } from 'rxjs/internal-compatibility';

@Injectable({
  providedIn: 'root'
})
export class SiteService {
  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly firestore: AngularFirestore,
    private readonly authService: AppAuthService,
  ) {
  }

  private getAvailableSites(): Observable<AngularTanamSite[]> {
    return fromPromise(this.authService.getCustomClaims())
      .pipe(switchMap((customClaims) => {
        const tanamSites = Object.keys(customClaims['tanam'] || {});
        console.log(`[getAvailableSites] ${JSON.stringify({ tanamSites })}`);
        return combineLatest(tanamSites.map((siteId) =>
          this.firestore.collection('tanam').doc<ITanamSite>(siteId)
            .valueChanges()
            .pipe(map((info) => new AngularTanamSite(info)))
        ));
      }));
  }

  getCurrentSite(): Observable<AngularTanamSite> {
    const domain = document.location.hostname;
    console.log(`[getSiteInfo] ${JSON.stringify({ domain })}`);
    return this.getAvailableSites()
      .pipe(
        map(sites => sites.filter(site => site.domains.indexOf(domain) >= 0)),
        map(sites => sites[0] || null),
        filter(site => !!site),
        tap(site => console.log(`[getCurrentSite] ${JSON.stringify({ site })}`)),
      );
  }

  getSiteName(): Observable<string> {
    return this.getCurrentSite().pipe(map(settings => settings.title));
  }

  getTheme(): Observable<string> {
    return this.getCurrentSite().pipe(map(settings => settings.theme));
  }

  getPrimaryDomain(): Observable<string> {
    return this.getCurrentSite().pipe(map(settings => settings.primaryDomain));
  }

  async save(site: AngularTanamSite) {
    const tanamSite = await this._currentSite;
    this.firestore.collection('tanam').doc(tanamSite.id).set(site.toJson());
  }

  get _currentSite(): Promise<TanamSite> {
    return this.getCurrentSite().pipe(take(1)).toPromise();
  }
}
