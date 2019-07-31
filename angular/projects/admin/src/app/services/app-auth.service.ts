import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppAuthService {

  constructor(
    private readonly fireAuth: AngularFireAuth,
  ) {
  }

  private static b64DecodeUnicode(str: string) {
    return decodeURIComponent(atob(str).replace(/(.)/g, function (m, p) {
      let code = p.charCodeAt(0).toString(16).toUpperCase();
      if (code.length < 2) {
        code = '0' + code;
      }
      return '%' + code;
    }));
  }

  isLoggedIn(): Observable<boolean> {
    return this.fireAuth.authState.pipe(
      map(user => !!user),
      tap(() => this.reloadUser()),
    );
  }

  login() {
    const provider = new auth.GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });

    return this.fireAuth.auth.signInWithPopup(provider);
  }

  logOut(): Promise<void> {
    return this.fireAuth.auth.signOut();
  }

  async getCustomClaims(): Promise<any> {
    const idToken = await this.fireAuth.auth.currentUser.getIdToken(true);
    return JSON.parse(AppAuthService.b64DecodeUnicode(idToken.split('.')[1]));
  }

  async reloadUser() {
    if (!this.fireAuth.auth.currentUser) {
      return null;
    }
    return this.fireAuth.auth.currentUser.reload();
  }
}
