import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire';
import { AppAuthService } from './app-auth.service';
import { AngularFirestore } from '@angular/fire/firestore';

export type UserRole = 'owner' | 'admin' | 'editor' | 'viewer';

export interface TanamUser {
  name: string;
  roles: UserRole[];
  prefs: { [key: string]: any };
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private readonly appAuthService: AppAuthService,
    private readonly fbApp: FirebaseApp,
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
}
