import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { MatDatetimepickerModule } from '@mat-datetimepicker/core';
import { MatMomentDatetimeModule } from '@mat-datetimepicker/moment';
import { AppMaterialModule } from '../../app-material.module';
import { DateTimeComponent } from './date-time/date-time.component';
import { DocumentReferenceComponent } from './document-reference/document-reference.component';
import { TextboxRichComponent } from './textbox-rich/textbox-rich.component';

@NgModule({
  declarations: [
    TextboxRichComponent,
    DateTimeComponent,
    DocumentReferenceComponent,
  ],
  imports: [
    CommonModule,
    AppMaterialModule,
    CKEditorModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatDatepickerModule,
    MatDatetimepickerModule,
    MatMomentDatetimeModule,
    FormsModule,
  ],
  exports: [
    TextboxRichComponent,
    DateTimeComponent,
    DocumentReferenceComponent,
  ]
})
export class FormModule { }
