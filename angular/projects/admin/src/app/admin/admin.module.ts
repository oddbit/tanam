import { LayoutModule } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppFirebaseModule } from '../app-firebase.module';
import { AppMaterialModule } from '../app-material.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { DocumentModule } from './document/document.module';
import { ContentTemplateModule } from './content-template/content-template.module';
import { ContentTypeModule } from './content-type/content-type.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormModule } from './form/form.module';
import { LoginComponent } from './login/login.component';
import { MediaModule } from './media/media.module';
import { NavigationModule } from './navigation/navigation.module';
import { NotFoundComponent } from './not-found/not-found.component';
import { SettingsModule } from './settings/settings.module';
import { ThemeModule } from './theme/theme.module';

@NgModule({
  declarations: [
    AdminComponent,
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
    DocumentModule,
    ContentTemplateModule,
    ContentTypeModule,
    NavigationModule,
    ThemeModule,
    FormModule,
  ]
})
export class AdminModule { }
