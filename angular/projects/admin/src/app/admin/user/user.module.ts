import { NgModule } from '@angular/core';
import { UserOverviewComponent } from './user-overview/user-overview.component';
import { AppMaterialModule } from '../../app-material.module';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';
import { UserListComponent } from './user-list/user-list.component';
import { UserInvitedComponent } from './user-invited/user-invited.component';
import { UserInviteDialogComponent } from './user-invite-dialog/user-invite-dialog.component';

@NgModule({
  declarations: [
    UserOverviewComponent,
    UserListComponent,
    UserInvitedComponent,
    UserInviteDialogComponent
  ],
  imports: [
    AppMaterialModule,
    VirtualScrollerModule
  ],
  exports: [UserOverviewComponent],
  entryComponents: [UserInviteDialogComponent]
})
export class UserModule { }
