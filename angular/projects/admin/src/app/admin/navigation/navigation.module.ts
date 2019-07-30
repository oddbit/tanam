import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppMaterialModule } from '../../app-material.module';
import { AdminRoutingModule } from '../admin-routing.module';
import { NavigationListItemComponent } from './navigation-list-item/navigation-list-item.component';
import { NavigationComponent } from './navigation.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { ProfileWidgetComponent } from './profile-widget/profile-widget.component';
import { NavigationHeaderComponent } from './navigation-header/navigation-header.component';
// import { ProjectSwitcherComponent } from './project-switcher/project-switcher.component';

@NgModule({
  declarations: [
    NavigationListItemComponent,
    NavigationComponent,
    NotificationsComponent,
    ProfileWidgetComponent,
    NavigationHeaderComponent,
    // ProjectSwitcherComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    AppMaterialModule,
  ],
  exports: [
    NavigationComponent,
  ],
})
export class NavigationModule { }
