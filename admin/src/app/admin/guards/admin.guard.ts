import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { take } from 'rxjs/operators';
import { UserService } from 'tanam-core';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private readonly userService: UserService,
    private readonly router: Router,
  ) { }

  async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const isAdmin = this.userService.hasRole('admin').pipe(take(1)).toPromise();
    const isOwner = this.userService.hasRole('owner').pipe(take(1)).toPromise();
    const results = await Promise.all([isAdmin, isOwner]);

    if (results.some(roleCheck => roleCheck)) {
      return true;
    }

    this.router.navigateByUrl('_/admin');
    return false;
  }
}
