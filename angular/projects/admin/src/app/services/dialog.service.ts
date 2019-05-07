import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DialogComponent } from '../admin/components/dialog/dialog.component';

type DialogButton = 'ok' | 'yes' | 'no' | 'cancel';
type DialogIcon= 'warning' | 'info' | 'error';

type IconColor = 'warn' | 'primary';
const ICON_COLORS: { [key: string]: IconColor } = {
  warning: 'warn',
  info: 'primary',
  error: 'warn',
};

interface DialogData {
  title: string;
  message: string;
  buttons: DialogButton[];
  icon: DialogIcon;
}


@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) { }

  openDialogConfirm(value: DialogData) {
    return this.dialog.open(DialogComponent, {
      data: {
        title: value.title,
        message: value.message,
        buttons: value.buttons,
        icon: value.icon,
        color: ICON_COLORS[value.icon]
      },
      width: '300px'
    });
  }
}
