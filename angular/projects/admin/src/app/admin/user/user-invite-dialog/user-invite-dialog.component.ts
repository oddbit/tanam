import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { UserService } from '../../../services/user.service';
import { ITanamUserRole, TanamUserRole, TanamUserRoleType } from 'tanam-models/user.models';

interface DialogRoleOption {
  value: TanamUserRoleType;
  text: string;
}

@Component({
  selector: 'tanam-user-invite-dialog',
  templateUrl: './user-invite-dialog.component.html',
  styleUrls: ['./user-invite-dialog.component.scss']
})
export class UserInviteDialogComponent {
  readonly defaultRole: TanamUserRoleType = 'admin';
  readonly roles: DialogRoleOption[] = [
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

  readonly addUserForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    role: [this.defaultRole, [Validators.required]]
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private readonly userService: UserService,
    private dialogRef: MatDialogRef<UserInviteDialogComponent>,
  ) {
  }

  async addUser() {
    this.snackBar.open('Sending Invitation', 'Dismiss', {
      duration: 2000,
    });
    await this.userService.inviteUser(new TanamUserRole(this.addUserForm.value as ITanamUserRole));
    this.dialogRef.close();
    this.snackBar.open('Sent', 'Dismiss', {
      duration: 2000,
    });
  }

}
