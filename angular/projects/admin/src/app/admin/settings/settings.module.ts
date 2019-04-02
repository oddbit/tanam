import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppFirebaseModule } from '../../app-firebase.module';
import { AppMaterialModule } from '../../app-material.module';
import { ComponentsModule } from '../components/components.module';
import { SettingsComponent } from './settings.component';
import { SettingsDialogManageLanguagesComponent } from './settings-dialog-manage-languages/settings-dialog-manage-languages.component';

@NgModule({
  declarations: [
    SettingsComponent,
    SettingsDialogManageLanguagesComponent,
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
  ],
  entryComponents: [SettingsDialogManageLanguagesComponent]
})
export class SettingsModule { }
