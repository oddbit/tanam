import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppFirebaseModule } from '../../app-firebase.module';
import { AppMaterialModule } from '../../app-material.module';
import { AdminRoutingModule } from '../admin-routing.module';
import { ComponentsModule } from '../components/components.module';
import { DocumentTypeEditComponent } from './document-type-edit/document-type-edit.component';
import { DocumentTypeFormComponent } from './document-type-form/document-type-form.component';
import { DocumentTypeListComponent } from './document-type-list/document-type-list.component';
import { DocumentTypeOverviewComponent } from './document-type-overview/document-type-overview.component';
import { DocumentTypeDialogCreateComponent } from './document-type-dialog-create/document-type-dialog-create.component';
import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
  declarations: [
    DocumentTypeEditComponent,
    DocumentTypeFormComponent,
    DocumentTypeListComponent,
    DocumentTypeOverviewComponent,
    DocumentTypeDialogCreateComponent,
  ],
  imports: [
    CommonModule,
    AppFirebaseModule,
    AppMaterialModule,
    AdminRoutingModule,
    ComponentsModule,
    ScrollingModule,
  ],
  exports: [
    DocumentTypeEditComponent,
    DocumentTypeOverviewComponent,
  ],
  entryComponents: [DocumentTypeDialogCreateComponent]
})
export class DocumentTypeModule { }
