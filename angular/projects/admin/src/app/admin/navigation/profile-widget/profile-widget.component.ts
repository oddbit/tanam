import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { AppAuthService } from '../../../services/app-auth.service';
import { AdminTheme } from 'tanam-models/theme.models';

@Component({
  selector: 'tanam-profile-widget',
  templateUrl: './profile-widget.component.html',
  styleUrls: ['./profile-widget.component.scss']
})
export class ProfileWidgetComponent implements OnInit {
  currentUser$ = this.userService.getCurrentUser();
  theme: AdminTheme;

  constructor(
    private readonly userService: UserService,
    private readonly appAuthService: AppAuthService
  ) {
  }

  ngOnInit() {
    this.currentUser$.subscribe(user => {
      this.theme = user.prefs.theme;
    });
    return this.appAuthService.reloadUser();
  }

  logout() {
    return this.appAuthService.logOut();
  }

  toggleTheme(e) {
    e.stopPropagation();
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    this.userService.setUserTheme(this.theme);
  }
}
