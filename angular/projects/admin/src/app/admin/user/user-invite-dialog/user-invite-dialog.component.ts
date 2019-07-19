import { Component, Input, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserService } from '../../../services/user.service';
import { UserRole } from '../../../../../../../../functions/src/models';

@Component({
  selector: 'tanam-user-invite-dialog',
  templateUrl: './user-invite-dialog.component.html',
  styleUrls: ['./user-invite-dialog.component.scss']
})
export class UserInviteDialogComponent {
  readonly defaultRole: UserRole = this.data.defaultRole;
  readonly roles: [] = this.data.roles;

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
  ) { }

  async addUser() {
    this.snackBar.open('Sending Invitation', 'Dismiss', {
      duration: 2000,
    });
    const formData = this.addUserForm.value;
    await this.userService.inviteUser(formData);
    this.dialogRef.close();
    this.snackBar.open('Sent', 'Dismiss', {
      duration: 2000,
    });
  }

}
