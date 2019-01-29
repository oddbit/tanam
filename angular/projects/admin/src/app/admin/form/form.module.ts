import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextboxRichComponent } from './textbox-rich/textbox-rich.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

@NgModule({
  declarations: [
    TextboxRichComponent,
  ],
  imports: [
    CommonModule,
    CKEditorModule,
  ],
  exports: [
    TextboxRichComponent,
  ]
})
export class FormModule { }
