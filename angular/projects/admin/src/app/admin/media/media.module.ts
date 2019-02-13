import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppMaterialModule } from '../../app-material.module';
import { AppFirebaseModule } from '../../app-firebase.module';
import { MediaComponent } from './media.component';
import { MediaGridComponent } from './media-grid/media-grid.component';
import { SharedModule } from '../shared.module';

@NgModule({
  declarations: [
    MediaComponent,
    MediaGridComponent,
  ],
  imports: [
    CommonModule,
    AppFirebaseModule,
    AppMaterialModule,
    SharedModule
  ],
  exports: [
    MediaComponent,
  ],
})
export class MediaModule { }
