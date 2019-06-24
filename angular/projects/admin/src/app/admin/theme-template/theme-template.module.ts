import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppFirebaseModule } from '../../app-firebase.module';
import { AppMaterialModule } from '../../app-material.module';
import { ComponentsModule } from '../components/components.module';
import { ThemeTemplateEditComponent } from './theme-template-edit/theme-template-edit.component';
import { ThemeTemplateFormComponent } from './theme-template-form/theme-template-form.component';
import { ThemeTemplateListComponent } from './theme-template-list/theme-template-list.component';
import { ThemeTemplateOverviewComponent } from './theme-template-overview/theme-template-overview.component';
import { ThemeTemplateDialogCreateComponent } from './theme-template-dialog-create/theme-template-dialog-create.component';
import {
  ThemeTemplateDialogListTemplateComponent
} from './theme-template-dialog-list-template/theme-template-dialog-list-template.component';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';

@NgModule({
  declarations: [
    ThemeTemplateEditComponent,
    ThemeTemplateFormComponent,
    ThemeTemplateListComponent,
    ThemeTemplateOverviewComponent,
    ThemeTemplateDialogCreateComponent,
    ThemeTemplateDialogListTemplateComponent,
  ],
  imports: [
    CommonModule,
    AppFirebaseModule,
    AppMaterialModule,
    ComponentsModule,
    VirtualScrollerModule,
  ],
  exports: [
    ThemeTemplateEditComponent,
    ThemeTemplateListComponent,
  ],
  entryComponents: [ThemeTemplateDialogCreateComponent, ThemeTemplateDialogListTemplateComponent]
})
export class ThemeTemplateModule { }
