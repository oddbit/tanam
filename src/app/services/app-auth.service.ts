import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AppAuthService {

  constructor(
    private readonly ngFireAuth: AngularFireAuth,
  ) { }

  isLoggedIn() {
    return of(true);
  }

  login() {
    this.ngFireAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  logOut() {
    this.ngFireAuth.auth.signOut();
  }
}
