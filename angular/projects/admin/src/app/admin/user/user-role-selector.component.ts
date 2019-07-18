import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'tanam-user-role-selector',
  template: `
  <mat-form-field>
    <mat-label>Role</mat-label>
    <mat-select value="{{role}}" (selectionChange)="onRoleChange()">
      <mat-option *ngFor="let role of roles"
                  value="{{role.value}}">{{role.text}}</mat-option>
    </mat-select>
  </mat-form-field>
  `,
  styles: []
})
export class UserRoleSelectorComponent {

  @Input() role: string;
  @Input() id: string;

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

  onRoleChange() {
    console.log(this.id);
  }

}
