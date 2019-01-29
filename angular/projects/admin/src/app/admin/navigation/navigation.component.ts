import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppAuthService, ContentTypeService, SiteSettingsService } from 'tanam-core';

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
  isExpanded = true;
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

  toggleMiniNav() {
    this.isExpanded = !this.isExpanded;
  }

  logout() {
    console.log(`[NavigationComponent:logout]`);
    this.appAuthService.logOut();
  }
}
