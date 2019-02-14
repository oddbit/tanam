import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionsComponent } from './actions.component';
import { ActionButtonComponent } from './action-button/action-button.component';
import { AppMaterialModule } from '../../app-material.module';
import { PortalModule } from '@angular/cdk/portal';

@NgModule({
  declarations: [
    ActionsComponent,
    ActionButtonComponent,
  ],
  imports: [
    CommonModule,
    AppMaterialModule,
    PortalModule
  ],
  exports: [
    ActionsComponent,
    ActionButtonComponent,
  ]
})
export class ActionsModule { }
