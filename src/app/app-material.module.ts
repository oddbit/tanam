import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatIconModule,
  MatListModule,
  MatSidenavModule,
  MatToolbarModule,
  MatCheckboxModule,
  MatChipsModule,
  MatInputModule,
  MatRadioModule,
  MatSelectModule,
  MatCardModule,
  MatTableModule,
  MatGridListModule,
  MatProgressSpinnerModule,
  MatMenuModule,
} from '@angular/material';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatCheckboxModule,
    MatChipsModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatCardModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatGridListModule,
    MatMenuModule,
  ],
  exports: [
    CommonModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatCheckboxModule,
    MatChipsModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatCardModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatGridListModule,
    MatMenuModule,
  ]
})
export class AppMaterialModule { }
