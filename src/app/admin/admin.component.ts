import { Component, OnInit } from '@angular/core';
import { UserConfigService } from '../services/user-config.service';
import { AppAuthService } from '../services/app-auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  theme$ = this.userConfig.getAdminTheme();
  isLoggedIn = this.appAuth.isLoggedIn();

  constructor(
    private readonly userConfig: UserConfigService,
    private readonly appAuth: AppAuthService,
  ) { }

  ngOnInit() {
  }
}
