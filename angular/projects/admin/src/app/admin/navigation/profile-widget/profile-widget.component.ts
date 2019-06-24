import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { AppAuthService } from '../../../services/app-auth.service';
import { tap } from 'rxjs/operators';
import { AdminTheme } from '../../../../../../../../functions/src/models';

@Component({
  selector: 'tanam-profile-widget',
  templateUrl: './profile-widget.component.html',
  styleUrls: ['./profile-widget.component.scss']
})
export class ProfileWidgetComponent implements OnInit {
  currentUser$ = this.userService.getCurrentUser().pipe(tap(() => this._reloaduser()));
  theme: AdminTheme;

  constructor(
    private readonly userService: UserService,
    private readonly appAuthService: AppAuthService
  ) { }

  ngOnInit() {
    this.currentUser$.subscribe(user => {
      this.theme = user.prefs.theme;
    });
  }

  logout() {
    this.appAuthService.logOut();
  }

  toggleTheme(e) {
    e.stopPropagation();
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    this.userService.setUserTheme(this.theme);
  }

  private async _reloaduser() {
    const payload = await this.appAuthService.reloadUser();
    if (!payload['tanam']) {
      alert('Fail to get user role, try again');
      this.logout();
    }
  }
}
