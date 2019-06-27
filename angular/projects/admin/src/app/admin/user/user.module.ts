import { NgModule } from '@angular/core';
import { UserOverviewComponent } from './user-overview/user-overview.component';
import { AppMaterialModule } from '../../app-material.module';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';
import { UserListComponent } from './user-list/user-list.component';

@NgModule({
  declarations: [
    UserOverviewComponent,
    UserListComponent
  ],
  imports: [
    AppMaterialModule,
    VirtualScrollerModule
  ],
  exports: [UserOverviewComponent]
})
export class UserModule { }
