import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppMaterialModule } from '../../app-material.module';
import { AdminRoutingModule } from '../admin-routing.module';
import { ActionButtonComponent } from './action-button/action-button.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { ContextActionsComponent } from './context-actions/context-actions.component';
import { PageTitleComponent } from './page-title/page-title.component';
import { DialogComponent } from './dialog/dialog.component';

@NgModule({
  declarations: [
    ActionButtonComponent,
    ContextActionsComponent,
    PageTitleComponent,
    BreadcrumbsComponent,
    BreadcrumbComponent,
    DialogComponent,
  ],
  imports: [
    CommonModule,
    PortalModule,
    AdminRoutingModule,
    AppMaterialModule,
  ],
  exports: [
    ActionButtonComponent,
    ContextActionsComponent,
    PageTitleComponent,
    BreadcrumbsComponent,
    BreadcrumbComponent,
  ],
  entryComponents: [DialogComponent]
})
export class ComponentsModule { }
