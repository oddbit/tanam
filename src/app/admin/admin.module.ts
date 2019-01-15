import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentTypeEditComponent } from './content-type-edit/content-type-edit.component';
import { ContentTypeOverviewComponent } from './content-type-overview/content-type-overview.component';
import { ContentEntryListComponent } from './content-entry-list/content-entry-list.component';
import { ContentEntryEditComponent } from './content-entry-edit/content-entry-edit.component';
import { SettingsDomainComponent } from './settings-domain/settings-domain.component';
import { SettingsSiteComponent } from './settings-site/settings-site.component';
import { NavigationComponent } from './navigation/navigation.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SettingsComponent } from './settings/settings.component';
import { ContentTypeListComponent } from './content-type-list/content-type-list.component';
import { AdminRoutingModule } from './admin-routing.module';
import { AppMaterialModule } from '../app-material.module';
import { AppFirebaseModule } from '../app-firebase.module';
import { AdminComponent } from './admin.component';
import { ContentTemplateFormComponent } from './content-template-form/content-template-form.component';
import { ContentTemplateListComponent } from './content-template-list/content-template-list.component';
import { NavigationListItemComponent } from './navigation-list-item/navigation-list-item.component';

@NgModule({
  declarations: [
    DashboardComponent,
    NavigationComponent,
    SettingsComponent,
    SettingsDomainComponent,
    SettingsSiteComponent,
    ContentTypeOverviewComponent,
    ContentTypeEditComponent,
    ContentEntryListComponent,
    ContentEntryEditComponent,
    ContentTypeListComponent,
    AdminComponent,
    ContentTemplateFormComponent,
    ContentTemplateListComponent,
    NavigationListItemComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    AppMaterialModule,
    AppFirebaseModule,
  ]
})
export class AdminModule { }
