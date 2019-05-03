import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { TanamFile } from '../../../../../../functions/src/models';
import { Observable, of } from 'rxjs';
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

  getThemeAssets(themeId: string): Observable <TanamFile[]> {
    return this.siteCollection
      .collection('themes').doc(themeId)
      .collection<TanamFile>('assets')
      .valueChanges();
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
