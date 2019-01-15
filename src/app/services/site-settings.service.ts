import { Injectable } from '@angular/core';

export const StringTemplates = {
  siteName: 'site_name',
  pageTitle: 'page_title',
};

@Injectable({
  providedIn: 'root'
})
export class SiteSettingsService {

  constructor() { }

  async getSiteName() {
    return 'MyTanam Site';
  }

  async getSiteTitleFormat() {
    return `${StringTemplates.siteName} | ${StringTemplates.pageTitle}`;
  }
}
