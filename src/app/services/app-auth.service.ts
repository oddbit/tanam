import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppAuthService {

  constructor() { }

  isLoggedIn() {
    return of(true);
  }
}
