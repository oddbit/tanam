import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
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
    const isOwner = this.userService.hasRole('owner').pipe(take(1)).toPromise();
    const isPublisher = this.userService.hasRole('publisher').pipe(take(1)).toPromise();
    const results = await Promise.all([isAdmin, isOwner, isPublisher]);

    if (results.some(roleCheck => roleCheck)) {
      return true;
    }

    this.router.navigateByUrl('_/admin');
    return false;
  }
}
