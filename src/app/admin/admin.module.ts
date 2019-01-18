import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppFirebaseModule } from '../app-firebase.module';
import { AppMaterialModule } from '../app-material.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { ContentEntryEditComponent } from './content-entry-edit/content-entry-edit.component';
import { ContentEntryFormComponent } from './content-entry-form/content-entry-form.component';
import { ContentEntryListComponent } from './content-entry-list/content-entry-list.component';
import { ContentEntryOverviewComponent } from './content-entry-overview/content-entry-overview.component';
import { ContentTemplateEditComponent } from './content-template-edit/content-template-edit.component';
import { ContentTemplateFormComponent } from './content-template-form/content-template-form.component';
import { ContentTemplateListComponent } from './content-template-list/content-template-list.component';
import { ContentTypeEditComponent } from './content-type-edit/content-type-edit.component';
import { ContentTypeFormComponent } from './content-type-form/content-type-form.component';
import { ContentTypeListComponent } from './content-type-list/content-type-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { NavigationListItemComponent } from './navigation-list-item/navigation-list-item.component';
import { NavigationComponent } from './navigation/navigation.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { SettingsModule } from './settings/settings.module';
import { MediaComponent } from './media/media.component';
import { MatGridListModule, MatCardModule, MatMenuModule, MatIconModule, MatButtonModule } from '@angular/material';
import { LayoutModule } from '@angular/cdk/layout';
import { ContentTypeOverviewComponent } from './content-type-overview/content-type-overview.component';
import { MediaModule } from './media/media.module';

@NgModule({
  declarations: [
    DashboardComponent,
    NavigationComponent,
    ContentTypeEditComponent,
    ContentEntryListComponent,
    ContentEntryEditComponent,
    ContentTypeListComponent,
    AdminComponent,
    ContentTemplateFormComponent,
    ContentTemplateListComponent,
    NavigationListItemComponent,
    ContentEntryFormComponent,
    ContentEntryOverviewComponent,
    ContentTemplateEditComponent,
    LoginComponent,
    NotFoundComponent,
    ContentTypeFormComponent,
    ContentTypeOverviewComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    AppMaterialModule,
    AppFirebaseModule,
    SettingsModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    LayoutModule,
    MediaModule,
  ]
})
export class AdminModule { }
