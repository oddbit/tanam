import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationListItemComponent } from './navigation-list-item/navigation-list-item.component';
import { NavigationComponent } from './navigation.component';
import { AdminRoutingModule } from '../admin-routing.module';
import { AppMaterialModule } from '../../app-material.module';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';

@NgModule({
  declarations: [
    NavigationListItemComponent,
    NavigationComponent,
    BreadcrumbComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    AppMaterialModule,
  ],
  exports: [
    NavigationComponent,
  ],
})
export class NavigationModule { }
