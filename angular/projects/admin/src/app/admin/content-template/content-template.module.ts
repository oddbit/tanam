import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppFirebaseModule } from '../../app-firebase.module';
import { AppMaterialModule } from '../../app-material.module';
import { ContentTemplateEditComponent } from './content-template-edit/content-template-edit.component';
import { ContentTemplateFormComponent } from './content-template-form/content-template-form.component';
import { ContentTemplateListComponent } from './content-template-list/content-template-list.component';
import { ContentTemplateOverviewComponent } from './content-template-overview/content-template-overview.component';

@NgModule({
  declarations: [
    ContentTemplateEditComponent,
    ContentTemplateFormComponent,
    ContentTemplateListComponent,
    ContentTemplateOverviewComponent,
  ],
  imports: [
    CommonModule,
    AppFirebaseModule,
    AppMaterialModule,
  ],
  exports: [
    ContentTemplateEditComponent,
    ContentTemplateListComponent,
  ],
})
export class ContentTemplateModule { }
