import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { AppAuthService } from '../../../services/app-auth.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'tanam-profile-widget',
  templateUrl: './profile-widget.component.html',
  styleUrls: ['./profile-widget.component.scss']
})
export class ProfileWidgetComponent implements OnInit {
  currentUser$ = this.userService.getCurrentUser().pipe(tap(() => this._reloaduser()));

  constructor(
    private readonly userService: UserService,
    private readonly appAuthService: AppAuthService
  ) { }

  ngOnInit() {
  }

  logout() {
    this.appAuthService.logOut();
  }

  private async _reloaduser() {
    const payload = await this.appAuthService.reloadUser();
    if (!payload['tanam']) {
      alert('Fail to get user role, try again');
      this.logout();
    }
  }
}
