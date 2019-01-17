import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentTypeEditComponent } from './content-type-edit/content-type-edit.component';
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
import { ContentEntryFormComponent } from './content-entry-form/content-entry-form.component';
import { ContentEntryOverviewComponent } from './content-entry-overview/content-entry-overview.component';
import { ContentTemplateEditComponent } from './content-template-edit/content-template-edit.component';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ContentTypeFormComponent } from './content-type-form/content-type-form.component';
import { MatInputModule, MatButtonModule, MatSelectModule, MatRadioModule, MatCardModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    DashboardComponent,
    NavigationComponent,
    SettingsComponent,
    SettingsDomainComponent,
    SettingsSiteComponent,
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
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    AppMaterialModule,
    AppFirebaseModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    ReactiveFormsModule,
  ]
})
export class AdminModule { }
