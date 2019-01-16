import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { SiteSettingsService, StringTemplates } from '../../services/site-settings.service';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DocumentHeaderService {

  constructor(
    private readonly titleService: Title,
    private readonly siteSettingsService: SiteSettingsService,
  ) { }

  async setTitle(title: string) {
    const siteName = await this.siteSettingsService.getSiteName().pipe(take(1)).toPromise();
    const siteTitleFormat = await this.siteSettingsService.getSiteTitleFormat().pipe(take(1)).toPromise();
    const pageTitle = siteTitleFormat
      .replace(StringTemplates.siteName, siteName)
      .replace(StringTemplates.pageTitle, title);
    this.titleService.setTitle(pageTitle);
  }
}
