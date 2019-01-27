import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';

export interface TanamTheme {
  id: string;
  title: string;
  description: string;
  images: string[];
  styles: string[];
  updatedAt: firebase.firestore.Timestamp | firebase.firestore.FieldValue;
  createdAt: firebase.firestore.Timestamp | firebase.firestore.FieldValue;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor(
    private readonly firestore: AngularFirestore,
  ) { }

  async create(id: string = this.firestore.createId()) {
    const docRef = this.firestore.collection('tanam-types').doc<TanamTheme>(id);
    return docRef.set({
      id: id,
      title: '',
      description: '',
      images: [],
      styles: [],
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    } as TanamTheme);
  }

  getThemes(): Observable<TanamTheme[]> {
    return this.firestore.collection<TanamTheme>('tanam-themes').valueChanges();
  }

  getTheme(themeId: string): Observable<TanamTheme> {
    return this.firestore.collection('tanam-themes').doc<TanamTheme>(themeId).valueChanges();
  }
}
