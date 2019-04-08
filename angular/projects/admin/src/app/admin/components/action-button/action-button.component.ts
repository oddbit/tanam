import { Component, OnInit, Input } from '@angular/core';

export type ActionButtonType = 'delete' | 'save' | 'create' | 'cancel' | 'upload' | 'editTemplate';


export type ActionButtonColor = 'primary' | 'warn';
const BUTTON_COLORS: { [key: string]: ActionButtonColor } = {
  delete: 'warn',
  save: 'primary',
  cancel: 'warn',
};

const BUTTON_TITLES = {
  delete: 'Delete',
  save: 'Save',
  edit: 'Edit',
  create: 'Create New',
  cancel: 'Cancel',
  upload: 'Upload',
  saveAndClose: 'Save and close',
};

const BUTTON_ICONS = {
  delete: 'delete',
  save: 'save',
  edit: 'edit',
  create: 'create',
  cancel: 'keyboard_arrow_left',
  upload: 'file_upload',
  saveAndClose: 'check',
};

@Component({
  selector: 'tanam-action-button',
  templateUrl: './action-button.component.html',
  styleUrls: ['./action-button.component.scss']
})
export class ActionButtonComponent implements OnInit {

  @Input() title: string;
  @Input() icon: string; // Must be a material icon id
  @Input() color: ActionButtonColor;
  @Input() buttonType: ActionButtonType;
  @Input() disabled: Boolean = false;

  constructor() { }

  ngOnInit() {
    this.title = this.title || BUTTON_TITLES[this.buttonType];
    this.icon = this.icon || BUTTON_ICONS[this.buttonType];
    this.color = this.color || BUTTON_COLORS[this.buttonType];
  }
}
