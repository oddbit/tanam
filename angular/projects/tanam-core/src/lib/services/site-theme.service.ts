import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { ContentTemplate, TanamTheme } from '../models/theme.models';

@Injectable({
  providedIn: 'root'
})
export class SiteThemeService {

  constructor(
    private readonly firestore: AngularFirestore,
  ) { }

  async createTheme(id: string = this.firestore.createId()) {
    const docRef = this.firestore.collection('tanam-types').doc<TanamTheme>(id);
    return docRef.set({
      id: id,
      title: '',
      description: '',
      images: [],
      styles: [],
      scripts: [],
      updated: firebase.firestore.FieldValue.serverTimestamp(),
      created: firebase.firestore.FieldValue.serverTimestamp(),
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
}
