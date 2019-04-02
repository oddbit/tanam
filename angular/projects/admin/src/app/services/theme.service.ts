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

  getNewId() {
    return this.firestore.createId();
  }

  async create(id: string) {
    const docRef = this.siteCollection.collection('themes').doc<Theme>(id);
    docRef.set({
      id: id,
      title: '',
      description: '',
      images: [],
      styles: [],
      scripts: [],
      updated: firebase.firestore.FieldValue.serverTimestamp(),
      created: firebase.firestore.FieldValue.serverTimestamp(),
    } as Theme);

    return docRef.collection('template').doc('page').set({
      id: 'page',
      selector: 'page',
      template: `{@contextDump to="console"/}
      {@select key=document.data.layout}
      Theme Work
      {/select}`,
      title: 'Page',
      updated: firebase.firestore.FieldValue.serverTimestamp(),
      created: firebase.firestore.FieldValue.serverTimestamp(),
    });
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
