import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppFirebaseModule } from '../../app-firebase.module';
import { AppMaterialModule } from '../../app-material.module';
import { FormModule } from '../form/form.module';
import { ContentEntryEditComponent } from './content-entry-edit/content-entry-edit.component';
import { ContentEntryFormComponent } from './content-entry-form/content-entry-form.component';
import { ContentEntryListComponent } from './content-entry-list/content-entry-list.component';
import { ContentEntryOverviewComponent } from './content-entry-overview/content-entry-overview.component';
import { ContentEntryNewComponent } from './content-entry-new/content-entry-new.component';

@NgModule({
  declarations: [
    ContentEntryEditComponent,
    ContentEntryFormComponent,
    ContentEntryListComponent,
    ContentEntryOverviewComponent,
    ContentEntryNewComponent,
  ],
  imports: [
    CommonModule,
    AppFirebaseModule,
    AppMaterialModule,
    FormModule,
  ],
  exports: [
    ContentEntryEditComponent,
    ContentEntryOverviewComponent,
    ContentEntryNewComponent,
  ],
})
export class ContentEntryModule { }
