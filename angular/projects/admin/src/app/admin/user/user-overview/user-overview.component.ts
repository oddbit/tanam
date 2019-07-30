import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserInviteDialogComponent } from '../user-invite-dialog/user-invite-dialog.component';

@Component({
  selector: 'tanam-user-overview',
  templateUrl: './user-overview.component.html',
  styleUrls: ['./user-overview.component.scss']
})
export class UserOverviewComponent {

  constructor(
    private dialog: MatDialog
  ) {
  }

  openDialogAddUser() {
    this.dialog.open(UserInviteDialogComponent);
  }
}
