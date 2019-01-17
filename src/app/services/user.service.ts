import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, tap } from 'rxjs/operators';
import { AppAuthService } from './app-auth.service';
import { UserPrefs } from './user-prefs.service';

export type UserRole = 'owner' | 'admin' | 'publisher' | 'designer' | 'reviewer';

export interface TanamUser {
  name: string;
  roles: UserRole[];
  prefs: UserPrefs;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private readonly appAuthService: AppAuthService,
    private readonly firestore: AngularFirestore,
  ) { }

  getCurrentUser() {
    const user = this.appAuthService.getFirebaseUser();
    return this.firestore
      .collection('tanam-users').doc<TanamUser>(user.uid)
      .valueChanges();
  }

  getUser(uid: string) {
    return this.firestore
      .collection('tanam-users').doc<TanamUser>(uid)
      .valueChanges();
  }

  hasSomeRole() {
    return this.getCurrentUser()
      .pipe(map(user => user.roles.length > 0))
      .pipe(tap(result => console.log(`[UserService:hasSomeRole] ${result}`)));
  }

  hasRole(role: UserRole) {
    return this.getCurrentUser()
      .pipe(map(user => user.roles.indexOf(role) !== -1))
      .pipe(tap(result => console.log(`[UserService:hasRole] ${role}: ${result}`)));
  }
}
