import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
// import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { MatDatetimepickerModule } from '@mat-datetimepicker/core';
import { MatMomentDatetimeModule } from '@mat-datetimepicker/moment';
import { AppMaterialModule } from '../../app-material.module';
import { DateTimeComponent } from './date-time/date-time.component';
import { DocumentReferenceComponent } from './document-reference/document-reference.component';
import { FilePickerComponent } from './file-picker/file-picker.component';
import { FilePickerDialogComponent } from './file-picker/file-picker-dialog/file-picker-dialog.component';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';
import { RichTextboxComponent } from './rich-textbox/rich-textbox.component';
import { CKEditorModule } from 'ng2-ckeditor';

@NgModule({
  declarations: [
    DateTimeComponent,
    DocumentReferenceComponent,
    FilePickerComponent,
    FilePickerDialogComponent,
    RichTextboxComponent,
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
    DateTimeComponent,
    DocumentReferenceComponent,
    FilePickerComponent,
    RichTextboxComponent
  ],
  entryComponents: [FilePickerDialogComponent]
})
export class FormModule { }
