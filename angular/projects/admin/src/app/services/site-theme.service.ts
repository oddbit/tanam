import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { SiteTheme } from 'tanam-models';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root'
})
export class SiteThemeService {
  readonly siteCollection = this.firestore.collection('tanam').doc(this.appConfig.siteId);

  constructor(
    private readonly firestore: AngularFirestore,
    private readonly appConfig: AppConfigService,
  ) { }

  async create(id: string = this.firestore.createId()) {
    const docRef = this.siteCollection.collection('document-types').doc<SiteTheme>(id);
    return docRef.set({
      id: id,
      title: '',
      description: '',
      images: [],
      styles: [],
      scripts: [],
      updated: firebase.firestore.FieldValue.serverTimestamp(),
      created: firebase.firestore.FieldValue.serverTimestamp(),
    } as SiteTheme);
  }

  update(theme: SiteTheme) {
    return this.siteCollection.collection('themes').doc<SiteTheme>(theme.id)
      .update({
        ...theme,
        updated: firebase.firestore.FieldValue.serverTimestamp(),
      });
  }

  getThemes(): Observable<SiteTheme[]> {
    return this.siteCollection.collection<SiteTheme>('themes').valueChanges();
  }

  getTheme(themeId: string): Observable<SiteTheme> {
    return this.siteCollection
      .collection('themes').doc<SiteTheme>(themeId)
      .valueChanges();
  }
}
