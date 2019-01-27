import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppAuthService } from '../../services/app-auth.service';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate {
  constructor(
    private readonly router: Router,
    private readonly appAuth: AppAuthService,
  ) { }
  async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const isLoggedIn = await this.appAuth.isLoggedIn().pipe(take(1)).toPromise();
    console.log(`[AdminAuthGuard:canActivate] User is logged in: ${isLoggedIn}`);
    return isLoggedIn || this.router.parseUrl('/_/login');
  }
}
