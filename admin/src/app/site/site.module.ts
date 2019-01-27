import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicPageComponent } from './dynamic-page/dynamic-page.component';
import { NotFoundComponent } from './not-found/not-found.component';

@NgModule({
  declarations: [
    DynamicPageComponent,
    NotFoundComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    DynamicPageComponent,
  ],
})
export class SiteModule { }
