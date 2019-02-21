import { Component, OnInit, Input } from '@angular/core';

export type ActionButtonType = 'delete' | 'save' | 'create' | 'cancel' | 'editTemplate';


@Component({
  selector: 'app-action-button',
  templateUrl: './action-button.component.html',
  styleUrls: ['./action-button.component.scss']
})
export class ActionButtonComponent implements OnInit {

  readonly BUTTON_COLORS = {
    delete: 'warn',
    save: 'primary',
    editTemplate: '',
    create: '',
    cancel: 'warn'
  };

  readonly BUTTON_TITLES = {
    delete: 'Delete',
    save: 'Save',
    editTemplate: 'Edit Template',
    create: 'Create new',
    cancel: 'Cancel'
  };

  readonly BUTTON_ICONS = {
    delete: 'delete',
    save: 'save',
    editTemplate: 'edit',
    create: 'create',
    cancel: 'keyboard_arrow_left'
  };

  @Input() buttonType: ActionButtonType;

  constructor() { }

  ngOnInit() {
  }
}
