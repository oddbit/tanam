import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatDialogRef } from '@angular/material';
import { UserService } from '../../../services/user.service';

export interface UserInvited {
  email: string;
  role: string;
}

@Component({
  selector: 'tanam-user-invite-dialog',
  templateUrl: './user-invite-dialog.component.html',
  styleUrls: ['./user-invite-dialog.component.scss']
})
export class UserInviteDialogComponent {

  readonly addUserForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    role: ['admin', [Validators.required]]
  });

  constructor(
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
