import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppFirebaseModule } from '../../app-firebase.module';
import { AppMaterialModule } from '../../app-material.module';
import { AdminRoutingModule } from '../admin-routing.module';
import { ComponentsModule } from '../components/components.module';
import { ThemeEditComponent } from './theme-edit/theme-edit.component';
import { ThemeFormComponent } from './theme-form/theme-form.component';
import { ThemeListComponent } from './theme-list/theme-list.component';
import { ThemeOverviewComponent } from './theme-overview/theme-overview.component';
import { ThemeAssetListComponent } from './theme-asset-list/theme-asset-list.component';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';

@NgModule({
  declarations: [
    ThemeOverviewComponent,
    ThemeListComponent,
    ThemeEditComponent,
    ThemeFormComponent,
    ThemeAssetListComponent,
  ],
  imports: [
    CommonModule,
    AppFirebaseModule,
    AppMaterialModule,
    AdminRoutingModule,
    ComponentsModule,
    VirtualScrollerModule
  ],
  exports: [
    ThemeOverviewComponent,
    ThemeEditComponent,
  ]
})
export class ThemeModule { }
