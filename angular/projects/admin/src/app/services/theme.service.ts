import { Injectable } from '@angular/core';
import { AngularFirestore, CollectionReference } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { Theme } from 'tanam-models';
import { AppConfigService } from './app-config.service';
import { UserThemeAssetService } from './user-theme-asset.service';

export interface ThemeQueryOptions {
  limit?: number;
  orderBy?: {
    field: string,
    sortOrder: 'asc' | 'desc',
  };
  startAt?: firebase.firestore.DocumentSnapshot;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  readonly siteCollection = this.firestore.collection('tanam').doc(this.appConfig.siteId);

  constructor(
    private readonly firestore: AngularFirestore,
    private readonly appConfig: AppConfigService,
    private readonly userThemeAssetService: UserThemeAssetService
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

    return docRef.collection('templates').doc('page').set({
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

  getThemes(queryOpts: ThemeQueryOptions): Observable<Theme[]> {

    const queryFn = (ref: CollectionReference) => {
      let query: any;
      if (queryOpts.orderBy) {
        query = ref.orderBy(queryOpts.orderBy.field, queryOpts.orderBy.sortOrder);
      }

      if (queryOpts.limit) {
        query = ref.limit(queryOpts.limit);
      }

      if (queryOpts.startAt) {
        query = ref.startAfter(queryOpts.startAt);
      }

      return query;
    };
    return this.siteCollection.collection<Theme>('themes', queryFn).valueChanges();
  }

  getTheme(themeId: string): Observable<Theme> {
    return this.siteCollection
      .collection('themes').doc<Theme>(themeId)
      .valueChanges();
  }

  deleteTheme(themeId: string, activeTheme: string) {
    if (!themeId) {
      throw new Error('Theme ID must be provided as an attribute when deleting a theme.');
    }
    if (themeId === activeTheme) {
      console.log('inside');
      throw new Error('Cannot deleting an active theme.');
    }
    return this.siteCollection
      .collection<Theme>('themes')
      .doc(themeId)
      .delete();
  }

  getReference(id: string) {
    if (!id) {
      return;
    }
    return this.siteCollection
      .collection('themes').doc(id).ref.get();
  }
}
