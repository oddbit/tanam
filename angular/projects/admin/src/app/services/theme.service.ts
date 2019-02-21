import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { Theme } from 'tanam-models';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  readonly siteCollection = this.firestore.collection('tanam').doc(this.appConfig.siteId);

  constructor(
    private readonly firestore: AngularFirestore,
    private readonly appConfig: AppConfigService,
  ) { }

  async create(id: string = this.firestore.createId()) {
    const docRef = this.siteCollection.collection('document-types').doc<Theme>(id);
    return docRef.set({
      id: id,
      title: '',
      description: '',
      images: [],
      styles: [],
      scripts: [],
      updated: firebase.firestore.FieldValue.serverTimestamp(),
      created: firebase.firestore.FieldValue.serverTimestamp(),
    } as Theme);
  }

  update(theme: Theme) {
    return this.siteCollection.collection('themes').doc<Theme>(theme.id)
      .update({
        ...theme,
        updated: firebase.firestore.FieldValue.serverTimestamp(),
      });
  }

  getThemes(): Observable<Theme[]> {
    return this.siteCollection.collection<Theme>('themes').valueChanges();
  }

  getTheme(themeId: string): Observable<Theme> {
    return this.siteCollection
      .collection('themes').doc<Theme>(themeId)
      .valueChanges();
  }
}
