import { Component, Input } from '@angular/core';
import { TanamUserRoleType } from 'tanam-models';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'tanam-user-role-selector',
  template: `
  <mat-form-field>
    <mat-label>Role</mat-label>
    <mat-select [value]="roles" (selectionChange)="onRoleChange($event.value)" multiple>
      <mat-option *ngFor="let role of rolesOption"
                  value="{{role.value}}">{{role.text}}</mat-option>
    </mat-select>
  </mat-form-field>
  `,
  styles: []
})
export class UserRoleSelectorComponent {

  @Input() roles: TanamUserRoleType;
  @Input() id: string;
  @Input() collection: string;

  readonly rolesOption = [
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
    private snackBar: MatSnackBar,
    private readonly userService: UserService
  ) { }

  async onRoleChange(roles: TanamUserRoleType[]) {
    this.snackBar.open('Updating Role..', 'Dismiss', { duration: 2000 });
    await this.userService.updateUserRoles(this.id, this.collection, roles);
    this.snackBar.open('Role Updated', 'Dismiss', { duration: 2000 });
  }

}
