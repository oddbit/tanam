import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserConfigService } from '../services/user-config.service';
import { AppAuthService } from '../services/app-auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {
  readonly theme$ = this.userConfig.getAdminTheme();

  private authSubscription: Subscription;

  constructor(
    private readonly router: Router,
    private readonly userConfig: UserConfigService,
    private readonly appAuthService: AppAuthService,
  ) { }

  ngOnInit() {
    this.authSubscription = this.appAuthService.isLoggedIn().subscribe(isLoggedIn => {
      console.log(`[AdminComponent:isLoggedIn] ${isLoggedIn}`);
      if (!isLoggedIn) {
        this.router.navigateByUrl(`/_/login`);
      }
    });
  }

  ngOnDestroy() {
    if (this.authSubscription && !this.authSubscription.closed) {
      this.authSubscription.unsubscribe();
    }
  }
}
