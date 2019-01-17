import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor(
    private readonly firestore: AngularFirestore,
  ) { }

  getThemes() {
    return this.firestore.collection('tanam-themes').valueChanges();
  }
}
