import { NgModule } from '@angular/core';
import { UserOverviewComponent } from './user-overview/user-overview.component';
import { AppMaterialModule } from '../../app-material.module';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';
import { UserListComponent } from './user-list/user-list.component';
import { UserInvitedComponent } from './user-invited/user-invited.component';

@NgModule({
  declarations: [
    UserOverviewComponent,
    UserListComponent,
    UserInvitedComponent
  ],
  imports: [
    AppMaterialModule,
    VirtualScrollerModule
  ],
  exports: [UserOverviewComponent]
})
export class UserModule { }
