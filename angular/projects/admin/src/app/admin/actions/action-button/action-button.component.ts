import { Component, OnInit, Input } from '@angular/core';

export type ActionButtonType = 'delete' | 'save';


@Component({
  selector: 'app-action-button',
  templateUrl: './action-button.component.html',
  styleUrls: ['./action-button.component.css']
})
export class ActionButtonComponent implements OnInit {

  readonly BUTTON_COLORS = {
    delete: 'warn',
    save: 'primary',
  };

  readonly BUTTON_TITLES = {
    delete: 'Delete',
    save: 'Save',
  };

  @Input() buttonType: ActionButtonType;

  constructor() { }

  ngOnInit() {
  }
}
