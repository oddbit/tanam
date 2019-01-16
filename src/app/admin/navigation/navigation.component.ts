import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ContentTypeService } from '../../services/content-type.service';
import { AppAuthService } from 'src/app/services/app-auth.service';
import { SiteSettingsService } from 'src/app/services/site-settings.service';

interface SideMenuItem {
  name: string;
  icon: string;
  link: string;
}
@Component({
  selector: 'app-admin-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  siteName$ = this.siteSettingsService.getSiteName();
  contentTypes$ = this.contentTypeService.getContentTypes();

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));

  constructor(
    private readonly breakpointObserver: BreakpointObserver,
    private readonly contentTypeService: ContentTypeService,
    private readonly appAuthService: AppAuthService,
    private readonly siteSettingsService: SiteSettingsService,
  ) { }

  logout() {
    console.log(`[NavigationComponent:logout]`);
    this.appAuthService.logOut();
  }
}
