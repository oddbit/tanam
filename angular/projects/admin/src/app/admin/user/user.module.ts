import { NgModule } from '@angular/core';
import { UserOverviewComponent } from './user-overview/user-overview.component';
import { AppMaterialModule } from '../../app-material.module';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';
import { UserListComponent } from './user-list/user-list.component';
import { UserInvitedComponent } from './user-invited/user-invited.component';
import { UserInviteDialogComponent } from './user-invite-dialog/user-invite-dialog.component';
import { ComponentsModule } from '../components/components.module';
import { UserRoleSelectorComponent } from './user-role-selector.component';

@NgModule({
  declarations: [
    UserOverviewComponent,
    UserListComponent,
    UserInvitedComponent,
    UserInviteDialogComponent,
    UserRoleSelectorComponent
  ],
  imports: [
    AppMaterialModule,
    VirtualScrollerModule,
    ComponentsModule
  ],
  exports: [UserOverviewComponent],
  entryComponents: [UserInviteDialogComponent]
})
export class UserModule { }
