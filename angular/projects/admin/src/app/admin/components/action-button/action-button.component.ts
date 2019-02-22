import { Component, OnInit, Input } from '@angular/core';

export type ActionButtonType = 'delete' | 'save' | 'create' | 'cancel'| 'upload' | 'editTemplate';


@Component({
  selector: 'tanam-action-button',
  templateUrl: './action-button.component.html',
  styleUrls: ['./action-button.component.scss']
})
export class ActionButtonComponent implements OnInit {

  readonly BUTTON_COLORS = {
    delete: 'warn',
    save: 'primary',
    editTemplate: '',
    create: '',
    cancel: 'warn',
    upload: '',
    editTheme: '',
  };

  readonly BUTTON_TITLES = {
    delete: 'Delete',
    save: 'Save',
    editTemplate: 'Edit Template',
    create: 'Create new',
    cancel: 'Cancel',
    upload: 'Upload',
    editTheme: 'Edit Theme',
  };

  readonly BUTTON_ICONS = {
    delete: 'delete',
    save: 'save',
    editTemplate: 'new',
    create: 'create',
    cancel: 'keyboard_arrow_left',
    upload: 'file_upload',
    editTheme: 'border_color',
  };

  @Input() buttonType: ActionButtonType;

  constructor() { }

  ngOnInit() {
  }
}
