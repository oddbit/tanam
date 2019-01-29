import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AppAuthService, UserPrefsService } from 'tanam-core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {
  readonly theme$: Observable<string> = this.userPrefs.getAdminTheme();

  private authSubscription: Subscription;

  constructor(
    private readonly router: Router,
    private readonly userPrefs: UserPrefsService,
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
