import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppAuthService } from 'src/app/services/app-auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  private authSubscription: Subscription;

  constructor(
    private readonly router: Router,
    private readonly appAuthService: AppAuthService,
  ) { }

  ngOnInit() {
    this.authSubscription = this.appAuthService.isLoggedIn().subscribe(isLoggedIn => {
      console.log(`[LoginComponent:isLoggedIn] ${isLoggedIn}`);
      if (isLoggedIn) {
        this.router.navigateByUrl(`/_/admin`);
      }
    });
  }

  ngOnDestroy() {
    if (this.authSubscription && !this.authSubscription.closed) {
      this.authSubscription.unsubscribe();
    }
  }

  login() {
    this.appAuthService.login();
  }
}
