import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { TanamFile } from '../../../../../../functions/src/models';
import { Observable, of } from 'rxjs';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root'
})
export class UserThemeAssetService {
  readonly siteCollection = this.firestore.collection('tanam').doc(this.appConfig.siteId);

  constructor(
    private readonly firestore: AngularFirestore,
    private readonly appConfig: AppConfigService
    ) { }

  getThemeAssets(themeId: string): Observable <TanamFile[]> {
  return this.siteCollection
  .collection('themes').doc(themeId)
  .collection<TanamFile>('assets')
  .valueChanges();
  }
}
