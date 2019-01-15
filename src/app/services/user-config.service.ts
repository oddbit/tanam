import { Injectable } from '@angular/core';
import { of } from 'rxjs';

export type AdminTheme = 'default' | 'light' | 'dark';

const AdminThemes = {
  'default': 'tanam-light-theme',
  'light': 'tanam-light-theme',
  'dark': 'tanam-dark-theme',
};
@Injectable({
  providedIn: 'root'
})
export class UserConfigService {

  constructor(
  ) { }

  getAdminTheme() {
    return of(AdminThemes.light);
  }

  setAdminTheme(theme: AdminTheme) {
    console.log('Set theme: ' + theme);
  }
}
