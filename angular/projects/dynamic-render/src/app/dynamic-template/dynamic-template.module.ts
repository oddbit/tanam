import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentsDirective } from './documents.directive';
import { DocumentDirective } from './document.directive';

@NgModule({
  declarations: [
    DocumentDirective,
    DocumentsDirective,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    DocumentDirective,
    DocumentsDirective,
  ]
})
export class DynamicTemplateModule { }
