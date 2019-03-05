import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextboxRichComponent } from './textbox-rich/textbox-rich.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { AuthorComponent } from './author/author.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule } from '@angular/material';

@NgModule({
  declarations: [
    TextboxRichComponent,
    AuthorComponent,
  ],
  imports: [
    CommonModule,
    CKEditorModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  exports: [
    TextboxRichComponent,
    AuthorComponent
  ]
})
export class FormModule { }
