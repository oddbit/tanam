import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeOverviewComponent } from './theme-overview/theme-overview.component';
import { ThemeListComponent } from './theme-list/theme-list.component';
import { ThemeEditComponent } from './theme-edit/theme-edit.component';
import { ThemeFormComponent } from './theme-form/theme-form.component';
import { AdminRoutingModule } from '../admin-routing.module';
import { AppMaterialModule } from '../../app-material.module';
import { AppFirebaseModule } from '../../app-firebase.module';

@NgModule({
  declarations: [
    ThemeOverviewComponent,
    ThemeListComponent,
    ThemeEditComponent,
    ThemeFormComponent,
  ],
  imports: [
    CommonModule,
    AppFirebaseModule,
    AppMaterialModule,
    AdminRoutingModule,
  ],
  exports: [
    ThemeOverviewComponent,
    ThemeEditComponent,
  ]
})
export class ThemeModule { }
