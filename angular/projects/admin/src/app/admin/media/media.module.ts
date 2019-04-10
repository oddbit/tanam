import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppFirebaseModule } from '../../app-firebase.module';
import { AppMaterialModule } from '../../app-material.module';
import { ComponentsModule } from '../components/components.module';
import { MediaGridComponent } from './media-grid/media-grid.component';
import { MediaComponent } from './media.component';
import { MediaDialogDetailComponent } from './media-dialog-detail/media-dialog-detail.component';

@NgModule({
  declarations: [
    MediaComponent,
    MediaGridComponent,
    MediaDialogDetailComponent,
  ],
  imports: [
    CommonModule,
    AppFirebaseModule,
    AppMaterialModule,
    ComponentsModule,
  ],
  exports: [
    MediaComponent,
  ],
  entryComponents: [MediaDialogDetailComponent]
})
export class MediaModule { }
