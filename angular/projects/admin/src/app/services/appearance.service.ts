import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { ADMIN_THEMES } from '../../../../../../functions/src/models';

const brandColor = '#43a047';

export const darkMode = {
  'primary-color': brandColor,
  'background-color': '#212121',
  'text-color': '#ffffff'
};

export const lightMode = {
  'primary-color': brandColor,
  'background-color': '#f9f9f9',
  'text-color': '#333333'
};

@Injectable({
  providedIn: 'root'
})
export class AppearanceService {

  constructor(
    private readonly userService: UserService
  ) { }

  initAppearanceMode() {
    this.userService.getUserTheme().subscribe(val => {
      const styles = val === ADMIN_THEMES.dark ? darkMode : lightMode;
      this.setCSSProperties(styles);
    });
  }

  setCSSProperties(styles: {}) {
    Object.keys(styles).forEach(key => document.documentElement.style.setProperty(`--${key}`, styles[key]));
  }
}
