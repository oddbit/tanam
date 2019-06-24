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
import { FilePickerComponent } from './file-picker/file-picker.component';
import { FilePickerDialogComponent } from './file-picker/file-picker-dialog/file-picker-dialog.component';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';

@NgModule({
  declarations: [
    TextboxRichComponent,
    DateTimeComponent,
    DocumentReferenceComponent,
    FilePickerComponent,
    FilePickerDialogComponent,
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
    VirtualScrollerModule,
  ],
  exports: [
    TextboxRichComponent,
    DateTimeComponent,
    DocumentReferenceComponent,
    FilePickerComponent,
  ],
  entryComponents: [FilePickerDialogComponent]
})
export class FormModule { }
