import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { take } from 'rxjs/operators';
import { UserService } from '../../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class PublisherGuard implements CanActivate {

  constructor(
    private readonly userService: UserService,
    private readonly router: Router,
  ) { }

  async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const isAdmin = this.userService.hasRole('admin').pipe(take(1)).toPromise();
    const isSuperAdmin = this.userService.hasRole('superAdmin').pipe(take(1)).toPromise();
    const isPublisher = this.userService.hasRole('publisher').pipe(take(1)).toPromise();
    const results = await Promise.all([isAdmin, isSuperAdmin, isPublisher]);

    if (results.some(roleCheck => roleCheck)) {
      return true;
    }

    this.router.navigateByUrl('_/admin');
    return false;
  }
}
