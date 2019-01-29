import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { TanamUser, UserRole } from '../models/user.models';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private readonly fireAuth: AngularFireAuth,
    private readonly firestore: AngularFirestore,
  ) { }

  getCurrentUser(): Observable<TanamUser> {
    const firebaseUser = this.fireAuth.auth.currentUser;
    return this.firestore
      .collection('tanam-users').doc<TanamUser>(firebaseUser.uid)
      .valueChanges();
  }

  getUser(uid: string): Observable<TanamUser> {
    return this.firestore
      .collection('tanam-users').doc<TanamUser>(uid)
      .valueChanges();
  }

  hasSomeRole(): Observable<boolean> {
    return this.getCurrentUser()
      .pipe(map(user => user.roles.length > 0))
      .pipe(tap(result => console.log(`[UserService:hasSomeRole] ${result}`)));
  }

  hasRole(role: UserRole): Observable<boolean> {
    return this.getCurrentUser()
      .pipe(map(user => user.roles.indexOf(role) !== -1))
      .pipe(tap(result => console.log(`[UserService:hasRole] ${role}: ${result}`)));
  }
}
