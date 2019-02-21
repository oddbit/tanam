import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppFirebaseModule } from '../../app-firebase.module';
import { AppMaterialModule } from '../../app-material.module';
import { ComponentsModule } from '../components/components.module';
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
    ComponentsModule,
  ],
  exports: [
    SettingsComponent,
  ]
})
export class SettingsModule { }
