import { LayoutModule } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
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
import { NotFoundComponent } from './not-found/not-found.component';
import { SettingsModule } from './settings/settings.module';
import { ContentTemplateModule } from './content-template/content-template.module';
import { ContentTypeModule } from './content-type/content-type.module';
import { NavigationModule } from './navigation/navigation.module';

@NgModule({
  declarations: [
    AdminComponent,
    ContentTemplateEditComponent,
    ContentTemplateFormComponent,
    ContentTemplateListComponent,
    DashboardComponent,
    LoginComponent,
    NotFoundComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    AppMaterialModule,
    AppFirebaseModule,
    SettingsModule,
    NavigationModule,
    LayoutModule,
    MediaModule,
    ContentEntryModule,
    ContentTemplateModule,
    ContentTypeModule,
    NavigationModule,
  ]
})
export class AdminModule { }
