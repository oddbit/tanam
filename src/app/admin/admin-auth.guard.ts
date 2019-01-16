import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppAuthService } from '../services/app-auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate {
  constructor(
    private readonly router: Router,
    private readonly appAuth: AppAuthService,
  ) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.appAuth.isLoggedIn().pipe(map(isLoggedIn => {
      console.log(`[AdminAuthGuard:canActivate] User is logged in: ${isLoggedIn}`);
      return isLoggedIn || this.router.parseUrl('/_/login');
    }));
  }
}
