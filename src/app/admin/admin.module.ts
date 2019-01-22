import { LayoutModule } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatCardModule, MatGridListModule, MatIconModule, MatMenuModule } from '@angular/material';
import { AppFirebaseModule } from '../app-firebase.module';
import { AppMaterialModule } from '../app-material.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { ContentEntryModule } from './content-entry/content-entry.module';
import { ContentTemplateEditComponent } from './content-template-edit/content-template-edit.component';
import { ContentTemplateFormComponent } from './content-template-form/content-template-form.component';
import { ContentTemplateListComponent } from './content-template-list/content-template-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { MediaModule } from './media/media.module';
import { NavigationListItemComponent } from './navigation-list-item/navigation-list-item.component';
import { NavigationComponent } from './navigation/navigation.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { SettingsModule } from './settings/settings.module';
import { ContentTemplateModule } from './content-template/content-template.module';
import { ContentTypeModule } from './content-type/content-type.module';

@NgModule({
  declarations: [
    AdminComponent,
    ContentTemplateEditComponent,
    ContentTemplateFormComponent,
    ContentTemplateListComponent,
    DashboardComponent,
    LoginComponent,
    NavigationComponent,
    NavigationListItemComponent,
    NotFoundComponent,
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
    ContentEntryModule,
    ContentTemplateModule,
    ContentTypeModule,
  ]
})
export class AdminModule { }
