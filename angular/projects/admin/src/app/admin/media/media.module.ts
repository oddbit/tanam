import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppFirebaseModule } from '../../app-firebase.module';
import { AppMaterialModule } from '../../app-material.module';
import { ComponentsModule } from '../components/components.module';
import { MediaGridComponent } from './media-grid/media-grid.component';
import { MediaComponent } from './media.component';

@NgModule({
  declarations: [
    MediaComponent,
    MediaGridComponent,
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
})
export class MediaModule { }
