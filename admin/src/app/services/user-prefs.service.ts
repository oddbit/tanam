import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, tap } from 'rxjs/operators';
import { AppAuthService } from './app-auth.service';
import { TanamUser } from './user.service';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';

export type AdminTheme = 'default' | 'light' | 'dark';

const THEMES = {
  'default': 'tanam-light-theme',
  'light': 'tanam-light-theme',
  'dark': 'tanam-dark-theme',
};
export interface UserPrefs {
  theme: string;
  language: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserPrefsService {

  constructor(
    private readonly fireAuth: AngularFireAuth,
    private readonly fbApp: FirebaseApp,
    private readonly firestore: AngularFirestore,
  ) { }

  getAdminTheme(): Observable<string> {
    const firebaseUser = this.fireAuth.auth.currentUser;
    return this.firestore
      .collection('tanam-users').doc<TanamUser>(firebaseUser.uid)
      .valueChanges()
      .pipe(map(tanamUser => !!tanamUser.prefs ? tanamUser.prefs : { theme: 'default' }))
      .pipe(map((prefs: { theme: AdminTheme }) => THEMES[prefs.theme] || THEMES['default']))
      .pipe(tap(theme => console.log(`[UserPrefsService:getAdminTheme] theme: ${theme}`)));
  }

  setAdminTheme(theme: AdminTheme) {
    const firebaseUser = this.fireAuth.auth.currentUser;
    const docRef = this.firestore.collection('tanam-users').doc<TanamUser>(firebaseUser.uid);
    return this.fbApp.firestore().runTransaction<void>(async (trx) => {
      const trxDoc = await trx.get(docRef.ref);
      const trxUser = trxDoc.data() as TanamUser;

      const prefs = { ...trxUser.prefs, theme };

      trx.update(docRef.ref, { prefs });
    });
  }
}
