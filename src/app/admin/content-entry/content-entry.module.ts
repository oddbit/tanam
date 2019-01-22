import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppMaterialModule } from '../../app-material.module';
import { AppFirebaseModule } from '../../app-firebase.module';
import { ContentEntryEditComponent } from './content-entry-edit/content-entry-edit.component';
import { ContentEntryOverviewComponent } from './content-entry-overview/content-entry-overview.component';
import { ContentEntryFormComponent } from './content-entry-form/content-entry-form.component';
import { ContentEntryListComponent } from './content-entry-list/content-entry-list.component';

@NgModule({
  declarations: [
    ContentEntryEditComponent,
    ContentEntryFormComponent,
    ContentEntryListComponent,
    ContentEntryOverviewComponent,
  ],
  imports: [
    CommonModule,
    AppFirebaseModule,
    AppMaterialModule,
  ],
  exports: [
    ContentEntryEditComponent,
    ContentEntryOverviewComponent,
  ],
})
export class ContentEntryModule { }
