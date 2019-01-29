import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppFirebaseModule } from '../../app-firebase.module';
import { AppMaterialModule } from '../../app-material.module';
import { DomainFormComponent } from './domain-form/domain-form.component';
import { SettingsComponent } from './settings.component';
import { SiteFormComponent } from './site-form/site-form.component';

@NgModule({
  declarations: [
    SettingsComponent,
    DomainFormComponent,
    SiteFormComponent,
  ],
  imports: [
    CommonModule,
    AppMaterialModule,
    AppFirebaseModule,
    AppMaterialModule,
  ],
  exports: [
    SettingsComponent,
  ]
})
export class SettingsModule { }
