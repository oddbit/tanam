import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { take } from 'rxjs/operators';
import { AppAuthService } from 'tanam-core';

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
