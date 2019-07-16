import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AppAuthService } from '../services/app-auth.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'tanam-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {
  readonly theme$: Observable<string> = this.userService.getUserTheme();

  private authSubscription: Subscription;

  constructor(
    private readonly router: Router,
    private readonly userService: UserService,
    private readonly appAuthService: AppAuthService,
  ) {
    userService.overlayTheme();
  }

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
