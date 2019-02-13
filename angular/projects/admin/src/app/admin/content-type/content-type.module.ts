import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentTypeEditComponent } from './content-type-edit/content-type-edit.component';
import { ContentTypeFormComponent } from './content-type-form/content-type-form.component';
import { ContentTypeListComponent } from './content-type-list/content-type-list.component';
import { ContentTypeOverviewComponent } from './content-type-overview/content-type-overview.component';
import { AppMaterialModule } from '../../app-material.module';
import { AppFirebaseModule } from '../../app-firebase.module';
import { AdminRoutingModule } from '../admin-routing.module';
import { SharedModule } from '../shared.module';

@NgModule({
  declarations: [
    ContentTypeEditComponent,
    ContentTypeFormComponent,
    ContentTypeListComponent,
    ContentTypeOverviewComponent,
  ],
  imports: [
    CommonModule,
    AppFirebaseModule,
    AppMaterialModule,
    AdminRoutingModule,
    SharedModule,
  ],
  exports: [
    ContentTypeEditComponent,
    ContentTypeOverviewComponent,
  ],
})
export class ContentTypeModule { }
