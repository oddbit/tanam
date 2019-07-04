import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'tanam-user-invite-dialog',
  templateUrl: './user-invite-dialog.component.html',
  styleUrls: ['./user-invite-dialog.component.scss']
})
export class UserInviteDialogComponent {

  readonly addUserForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    role: ['Admin', [Validators.required]]
  });

  constructor(
    private readonly formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) { }

  addUser() {
    this.snackBar.open('Sending Invitation', 'Dismiss', {
      duration: 2000,
    });
    const formData = this.addUserForm.value;
    console.log(formData.email);
    console.log(formData.role);
    this.snackBar.open('Sent', 'Dismiss', {
      duration: 2000,
    });
  }

}
