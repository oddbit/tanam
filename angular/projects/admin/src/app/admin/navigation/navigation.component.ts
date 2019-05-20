import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppAuthService } from '../../services/app-auth.service';
import { DocumentTypeService } from '../../services/document-type.service';
import { SiteService } from '../../services/site.service';

@Component({
  selector: 'tanam-admin-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  opened: boolean = false;
  isExpanded = true;
  siteName$ = this.siteSettingsService.getSiteName();
  documentTypes$ = this.documentTypeService.getDocumentTypes();

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));


  constructor(
    private readonly breakpointObserver: BreakpointObserver,
    private readonly documentTypeService: DocumentTypeService,
    private readonly appAuthService: AppAuthService,
    private readonly siteSettingsService: SiteService,
  ) { }

  toggleMiniNav() {
    this.isExpanded = !this.isExpanded;
  }

  showNotifications() {
    this.opened = !this.opened;
  }

  logout() {
    console.log(`[NavigationComponent:logout]`);
    this.appAuthService.logOut();
  }
}
