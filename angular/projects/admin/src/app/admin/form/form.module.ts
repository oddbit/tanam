import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextboxRichComponent } from './textbox-rich/textbox-rich.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { DateTimeComponent } from './date-time/date-time.component';
import { MatDatepickerModule, MatInputModule } from '@angular/material';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatDatetimepickerModule, MAT_DATETIME_FORMATS } from '@mat-datetimepicker/core';
import { MatMomentDatetimeModule } from '@mat-datetimepicker/moment';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    TextboxRichComponent,
    DateTimeComponent,
  ],
  imports: [
    CommonModule,
    CKEditorModule,
    MatInputModule,
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
  ],
  providers: [
    {
      provide: MAT_DATETIME_FORMATS,
      useValue: {
        parse: {
          dateInput: 'L',
          monthInput: 'MM',
          timeInput: 'HH:mm',
          datetimeInput: 'L H HH'
        },
        display: {
          dateInput: 'L',
          monthInput: 'MM',
          datetimeInput: 'L HH:mm',
          timeInput: 'HH:mm',
          monthYearLabel: 'MM YYYY',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'MM YYYY',
          popupHeaderDateLabel: 'ddd, DD MM'
        }
      }
    }
  ]
})
export class FormModule { }
