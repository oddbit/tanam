import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppFirebaseModule } from '../../app-firebase.module';
import { AppMaterialModule } from '../../app-material.module';
import { ComponentsModule } from '../components/components.module';
import { FormModule } from '../form/form.module';
import { ContentEntryEditComponent } from './content-entry-edit/content-entry-edit.component';
import { ContentEntryFormComponent } from './content-entry-form/content-entry-form.component';
import { ContentEntryListComponent } from './content-entry-list/content-entry-list.component';
import { ContentEntryOverviewComponent } from './content-entry-overview/content-entry-overview.component';

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
    FormModule,
    ComponentsModule,
  ],
  exports: [
    ContentEntryEditComponent,
    ContentEntryOverviewComponent,
  ],
})
export class ContentEntryModule { }
