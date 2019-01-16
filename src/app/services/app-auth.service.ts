import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppAuthService {

  constructor(
    private readonly ngFireAuth: AngularFireAuth,
  ) { }

  isLoggedIn() {
    return this.ngFireAuth.user.pipe(map(user => !!user));
  }

  login() {
    this.ngFireAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  logOut() {
    this.ngFireAuth.auth.signOut();
  }
}
