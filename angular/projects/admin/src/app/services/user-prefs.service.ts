import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AdminTheme, TanamUser, ADMIN_THEMES } from 'tanam-models';


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
      .pipe(map((prefs: { theme: AdminTheme }) => ADMIN_THEMES[prefs.theme] || ADMIN_THEMES['default']))
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
