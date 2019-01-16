import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { AppAuthService } from './app-auth.service';
import { TanamUser } from './user.service';

export type AdminTheme = 'default' | 'light' | 'dark';

const THEMES = {
  'default': 'tanam-light-theme',
  'light': 'tanam-light-theme',
  'dark': 'tanam-dark-theme',
};

@Injectable({
  providedIn: 'root'
})
export class UserPrefsService {

  constructor(
    private readonly appAuthService: AppAuthService,
    private readonly fbApp: FirebaseApp,
    private readonly firestore: AngularFirestore,
  ) { }

  getAdminTheme() {
    const user = this.appAuthService.getFirebaseUser();
    return this.firestore
      .collection('tanam-users').doc<TanamUser>(user.uid)
      .valueChanges()
      .pipe(map(u => THEMES[u.prefs.theme] || THEMES['default']));
  }

  setAdminTheme(theme: AdminTheme) {
    const user = this.appAuthService.getFirebaseUser();
    const docRef = this.firestore.collection('tanam-users').doc<TanamUser>(user.uid);
    return this.fbApp.firestore().runTransaction<void>(async (trx) => {
      const trxDoc = await trx.get(docRef.ref);
      const trxUser = trxDoc.data() as TanamUser;

      const prefs = { ...trxUser.prefs, theme };

      trx.update(docRef.ref, { prefs });
    });
  }
}
