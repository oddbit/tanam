import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { AdminTheme, THEMES } from '../../../../models/theme';
import { TanamUser } from '../../../../models/user';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class UserPrefsService {

  constructor(
    private readonly userService: UserService,
    private readonly firestore: AngularFirestore,
  ) { }

  getAdminTheme(): Observable<string> {
    return this.userService.getCurrentUser()
      .pipe(map(tanamUser => !!tanamUser.prefs ? tanamUser.prefs : { theme: 'default' }))
      .pipe(map((prefs: { theme: AdminTheme }) => THEMES[prefs.theme] || THEMES['default']))
      .pipe(tap(theme => console.log(`[UserPrefsService:getAdminTheme] theme: ${theme}`)));
  }

  async setAdminTheme(theme: AdminTheme): Promise<firebase.firestore.Transaction> {
    const user = await this.userService.getCurrentUser().pipe(take(1)).toPromise();
    const docRef = this.firestore.collection('tanam-users').doc<TanamUser>(user.uid);
    return this.firestore.firestore.runTransaction(async (trx) => {
      const trxDoc = await trx.get(docRef.ref);
      const trxUser = trxDoc.data() as TanamUser;

      const prefs = { ...trxUser.prefs, theme };

      return trx.update(docRef.ref, { prefs });
    });
  }
}
