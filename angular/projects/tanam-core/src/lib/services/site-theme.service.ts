import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { TanamTheme } from '../models/theme.models';
import { SiteSettingsService } from './site-settings.service';

@Injectable({
  providedIn: 'root'
})
export class SiteThemeService {

  constructor(
    private readonly firestore: AngularFirestore,
    private readonly siteSettingsService: SiteSettingsService,
  ) { }

  async create(id: string = this.firestore.createId()) {
    const docRef = this.firestore.collection('tanam-types').doc<TanamTheme>(id);
    return docRef.set({
      id: id,
      title: '',
      description: '',
      images: [],
      styles: [],
      scripts: [],
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    } as TanamTheme);
  }

  getThemes(): Observable<TanamTheme[]> {
    return this.firestore.collection<TanamTheme>('tanam-themes').valueChanges();
  }

  getTheme(themeId: string): Observable<TanamTheme> {
    return this.firestore
      .collection('tanam-themes').doc<TanamTheme>(themeId)
      .valueChanges();
  }

  getCurrentTheme(): Observable<TanamTheme> {
    return this.siteSettingsService.getSiteTheme()
      .pipe(switchMap(themeId => this.getTheme(themeId)));
  }
}
