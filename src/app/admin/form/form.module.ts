import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextboxRichComponent } from './textbox-rich/textbox-rich.component';

@NgModule({
  declarations: [
    TextboxRichComponent,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    TextboxRichComponent,
  ]
})
export class FormModule { }
