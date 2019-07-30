import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../../services/user.service';
import { TanamUserRoleType } from 'tanam-models/user.models';
import { AngularUserInvite } from '../../../app.models';

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
  buttonSendIsLoading = false;

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
    roles: [[this.defaultRole], [Validators.required]]
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
    this.buttonSendIsLoading = true;
    this.snackBar.open('Sending Invitation', 'Dismiss', {
      duration: 2000,
    });
    const userStatus = await this.userService.inviteUser(new AngularUserInvite(this.addUserForm.value));
    if (userStatus === 'userInvited') {
      this.dialogRef.close();
      this.snackBar.open('Sent', 'Dismiss', {
        duration: 2000,
      });
      this.buttonSendIsLoading = false;
    } else if (userStatus === 'userAlreadyCreated') {
      this.snackBar.open('User already created', 'Dismiss', {
        duration: 2000,
      });
      this.buttonSendIsLoading = false;
    }
  }

}
