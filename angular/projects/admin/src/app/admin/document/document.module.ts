import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppFirebaseModule } from '../../app-firebase.module';
import { AppMaterialModule } from '../../app-material.module';
import { ComponentsModule } from '../components/components.module';
import { FormModule } from '../form/form.module';
import { DocumentEditComponent } from './document-edit/document-edit.component';
import { DocumentListComponent } from './document-list/document-list.component';
import { DocumentOverviewComponent } from './document-overview/document-overview.component';
import { MatInputModule } from '@angular/material';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';

@NgModule({
  declarations: [
    DocumentEditComponent,
    DocumentListComponent,
    DocumentOverviewComponent,
  ],
  imports: [
    CommonModule,
    AppFirebaseModule,
    AppMaterialModule,
    FormModule,
    ComponentsModule,
    MatInputModule,
    VirtualScrollerModule,

  ],
  exports: [
    DocumentEditComponent,
    DocumentOverviewComponent,
  ]
})
export class DocumentModule { }
