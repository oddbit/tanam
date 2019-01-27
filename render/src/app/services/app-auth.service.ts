import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppAuthService {

  constructor(
    private readonly fireAuth: AngularFireAuth,
  ) { }

  isLoggedIn(): Observable<boolean> {
    return this.fireAuth.authState.pipe(map(user => !!user));
  }

  login() {
    this.fireAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  logOut() {
    return this.fireAuth.auth.signOut();
  }
}
