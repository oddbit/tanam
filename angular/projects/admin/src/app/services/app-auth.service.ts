import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

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

  logOut(): Promise<void> {
    return this.fireAuth.auth.signOut();
  }

  async reloadUser() {
    const idToken = await this.fireAuth.auth.currentUser.getIdToken(true);
    const payload = JSON.parse(this.b64DecodeUnicode(idToken.split('.')[1]));
    console.log('[User Token] ', payload);
    return payload;
  }

  b64DecodeUnicode(str: string) {
    return decodeURIComponent(atob(str).replace(/(.)/g, function (m, p) {
      let code = p.charCodeAt(0).toString(16).toUpperCase();
      if (code.length < 2) {
        code = '0' + code;
      }
      return '%' + code;
    }));
  }
}
