import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppFirebaseModule } from '../../app-firebase.module';
import { AppMaterialModule } from '../../app-material.module';
import { ThemeTemplateEditComponent } from './theme-template-edit/theme-template-edit.component';
import { ThemeTemplateFormComponent } from './theme-template-form/theme-template-form.component';
import { ThemeTemplateListComponent } from './theme-template-list/theme-template-list.component';
import { ThemeTemplateOverviewComponent } from './theme-template-overview/theme-template-overview.component';

@NgModule({
  declarations: [
    ThemeTemplateEditComponent,
    ThemeTemplateFormComponent,
    ThemeTemplateListComponent,
    ThemeTemplateOverviewComponent,
  ],
  imports: [
    CommonModule,
    AppFirebaseModule,
    AppMaterialModule,
  ],
  exports: [
    ThemeTemplateEditComponent,
    ThemeTemplateListComponent,
  ],
})
export class ThemeTemplateModule { }
