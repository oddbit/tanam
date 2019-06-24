import { Injectable } from '@angular/core';
import { AngularFirestore, CollectionReference, Query } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { TanamFile, ThemeAssetQueryOptions } from '../../../../../../functions/src/models';
import { Observable } from 'rxjs';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root'
})
export class UserThemeAssetService {
  readonly siteCollection = this.firestore.collection('tanam').doc(this.appConfig.siteId);
  readonly siteStorage = this.fireStorage.ref(`/tanam/${this.appConfig.siteId}`);

  constructor(
    private readonly firestore: AngularFirestore,
    private readonly appConfig: AppConfigService,
    private readonly fireStorage: AngularFireStorage,
  ) { }

  uploadThemeAsset(file: File, themeId: string): Observable<number> {
    console.log(file);
    const storageRef = this.siteStorage.child(`themes/${themeId}/${file.name}`);
    return storageRef.put(file).percentageChanges();
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

    return this.siteCollection
      .collection('themes').doc(themeId)
      .collection<TanamFile>('assets', queryFn)
      .valueChanges();
  }

  getReference(themeId: string, assetId: string) {
    return this.siteCollection
      .collection('themes').doc(themeId)
      .collection<TanamFile>('assets').doc(assetId)
      .ref.get();
  }

  deleteThemeAsset(file: TanamFile, themeId: string) {
    console.log(file.id);
    console.log(themeId);
    return this.siteCollection
      .collection('themes').doc(themeId)
      .collection<TanamFile>('assets')
      .doc(file.id)
      .delete();
  }
}
