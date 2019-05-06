import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { AppAuthService } from '../../../services/app-auth.service';

@Component({
  selector: 'tanam-profile-widget',
  templateUrl: './profile-widget.component.html',
  styleUrls: ['./profile-widget.component.scss']
})
export class ProfileWidgetComponent implements OnInit {
  currentUser$ = this.userService.getCurrentUser();

  constructor(
    private readonly userService: UserService,
    private readonly appAuthService: AppAuthService
  ) { }

  ngOnInit() {
  }

  logout() {
    this.appAuthService.logOut();
  }

}
