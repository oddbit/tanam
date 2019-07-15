import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { UserInviteDialogComponent } from '../user-invite-dialog/user-invite-dialog.component';
import { UserRole } from '../../../../../../../../functions/src/models';

@Component({
  selector: 'tanam-user-overview',
  templateUrl: './user-overview.component.html',
  styleUrls: ['./user-overview.component.scss']
})
export class UserOverviewComponent {
  readonly defaultRole: UserRole = 'admin';

  readonly roles = [
    {
      value: 'admin',
      text: 'Admin'
    },
    {
      value: 'superAdmin',
      text: 'Super Admin',
    },
    {
      value: 'publisher',
      text: 'Publisher'
    }
  ];

  constructor(
    private dialog: MatDialog
  ) { }

  openDialogAddUser() {
    this.dialog.open(UserInviteDialogComponent, {
      data: {
        defaultRole: this.defaultRole,
        roles: this.roles
      }
    });
  }
}
