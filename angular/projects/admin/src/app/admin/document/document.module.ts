import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppFirebaseModule } from '../../app-firebase.module';
import { AppMaterialModule } from '../../app-material.module';
import { ComponentsModule } from '../components/components.module';
import { FormModule } from '../form/form.module';
import { DocumentEditComponent } from './document-edit/document-edit.component';
import { DocumentFormComponent } from './document-form/document-form.component';
import { DocumentListComponent } from './document-list/document-list.component';
import { DocumentOverviewComponent } from './document-overview/document-overview.component';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatDatetimepickerModule, MAT_DATETIME_FORMATS } from '@mat-datetimepicker/core';
import { MatMomentDatetimeModule } from '@mat-datetimepicker/moment';
import { MatInputModule, MatDatepickerModule } from '@angular/material';

@NgModule({
  declarations: [
    DocumentEditComponent,
    DocumentFormComponent,
    DocumentListComponent,
    DocumentOverviewComponent,
  ],
  imports: [
    CommonModule,
    AppFirebaseModule,
    AppMaterialModule,
    FormModule,
    ComponentsModule,
    MatInputModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatDatepickerModule,
    MatDatetimepickerModule,
    MatMomentDatetimeModule,
  ],
  exports: [
    DocumentEditComponent,
    DocumentOverviewComponent,
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
export class DocumentModule { }
