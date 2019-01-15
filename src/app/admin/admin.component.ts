import { Component, OnInit } from '@angular/core';
import { UserConfigService } from '../services/user-config.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  theme$ = this.userConfig.getAdminTheme();
  constructor(
    private readonly userConfig: UserConfigService,
  ) { }

  ngOnInit() {
  }
}
