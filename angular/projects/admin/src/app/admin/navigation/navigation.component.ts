import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppAuthService } from '../../services/app-auth.service';
import { DocumentTypeService } from '../../services/document-type.service';
import { SiteService } from '../../services/site.service';
import { NotificationsService } from '../../services/notifications.service';

@Component({
  selector: 'tanam-admin-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  isExpanded = true;
  siteName$ = this.siteSettingsService.getSiteName();
  documentTypes$ = this.documentTypeService.getDocumentTypes();

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));

  notifications$ = this.notificationService.getNofifications();

  constructor(
    private readonly breakpointObserver: BreakpointObserver,
    private readonly documentTypeService: DocumentTypeService,
    private readonly appAuthService: AppAuthService,
    private readonly siteSettingsService: SiteService,
    private readonly notificationService: NotificationsService,
  ) { }

  toggleMiniNav() {
    this.isExpanded = !this.isExpanded;
  }

  showNotifications() {
    // Open the drawer
  }

  logout() {
    console.log(`[NavigationComponent:logout]`);
    this.appAuthService.logOut();
  }
}
