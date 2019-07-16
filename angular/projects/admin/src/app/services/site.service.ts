import { Inject, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ITanamSite } from 'tanam-models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';
import { AngularTanamSite } from '../app.models';

@Injectable({
  providedIn: 'root'
})
export class SiteService {
  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly firestore: AngularFirestore,
  ) {
  }

  getCurrentSite(): Observable<AngularTanamSite> {
    const domain = document.location.hostname;
    console.log(`[getSiteInfo] ${domain}`);
    return this.firestore
      .collection<ITanamSite>('tanam', (ref) =>
        ref.where('domains', 'array-contains', domain).limit(1),
      )
      .valueChanges()
      .pipe(
        map((info) => new AngularTanamSite(info[0])),
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

  save(site: AngularTanamSite) {
    return this.firestore.collection('tanam').doc(site.id).set(site.toJson());
  }
}
