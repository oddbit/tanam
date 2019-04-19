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
import { DocumentTypeDialogDeleteComponent } from './document-type-dialog-delete/document-type-dialog-delete.component';

@NgModule({
  declarations: [
    DocumentTypeEditComponent,
    DocumentTypeFormComponent,
    DocumentTypeListComponent,
    DocumentTypeOverviewComponent,
    DocumentTypeDialogCreateComponent,
    DocumentTypeDialogDeleteComponent,
  ],
  imports: [
    CommonModule,
    AppFirebaseModule,
    AppMaterialModule,
    AdminRoutingModule,
    ComponentsModule,
  ],
  exports: [
    DocumentTypeEditComponent,
    DocumentTypeOverviewComponent,
  ],
  entryComponents: [DocumentTypeDialogCreateComponent, DocumentTypeDialogDeleteComponent]
})
export class DocumentTypeModule { }
