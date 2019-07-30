import { Injectable } from '@angular/core';
import { AngularFirestore, CollectionReference, Query } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { TanamFile, TanamSite, ThemeAssetQueryOptions } from '../../../../../../functions/src/models';
import { Observable } from 'rxjs';
import { SiteService } from './site.service';
import { switchMap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserThemeAssetService {
  constructor(
    private readonly firestore: AngularFirestore,
    private readonly fireStorage: AngularFireStorage,
    private readonly siteService: SiteService,
  ) {
  }

  uploadThemeAsset(file: File, themeId: string): Observable<number | unknown> {
    return this.siteService.getCurrentSite().pipe(
      switchMap((site) =>
        this.fireStorage
          .ref(`/tanam/${site.id}`)
          .child(`themes/${themeId}/${file.name}`)
          .put(file).percentageChanges()
      ),
    );
  }

  getThemeAssets(themeId: string, queryOpts?: ThemeAssetQueryOptions): Observable<TanamFile[]> {
    const queryFn = (ref: CollectionReference) => {
      if (queryOpts) {
        let query: Query = ref;
        if (queryOpts.orderBy) {
          query = query.orderBy(queryOpts.orderBy.field, queryOpts.orderBy.sortOrder);
        }
        if (queryOpts.startAfter) {
          query = query.startAfter(queryOpts.startAfter);
        }
        if (queryOpts.limit) {
          query = query.limit(queryOpts.limit);
        }
        return query;
      }
      return ref;
    };

    return this.siteService.getCurrentSite().pipe(
      switchMap((site) =>
        this.firestore
          .collection('tanam').doc(site.id)
          .collection('themes').doc(themeId)
          .collection<TanamFile>('assets', queryFn)
          .valueChanges()
      ),
    );
  }

  async getReference(themeId: string, assetId: string) {
    const tanamSite = await this._currentSite;
    return this.firestore
      .collection('tanam').doc(tanamSite.id)
      .collection('themes').doc(themeId)
      .collection<TanamFile>('assets').doc(assetId)
      .ref.get();
  }

  async deleteThemeAsset(file: TanamFile, themeId: string) {
    const tanamSite = await this._currentSite;
    return this.firestore
      .collection('tanam').doc(tanamSite.id)
      .collection('themes').doc(themeId)
      .collection<TanamFile>('assets')
      .doc(file.id)
      .delete();
  }

  get _currentSite(): Promise<TanamSite> {
    return this.siteService.getCurrentSite().pipe(take(1)).toPromise();
  }
}
