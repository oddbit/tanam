import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../admin/components/dialog/dialog.component';

type DialogButton = 'ok' | 'yes' | 'no' | 'cancel';
type DialogIcon= 'warning' | 'info' | 'error';

type IconColor = 'warn' | 'primary';
const ICON_COLORS: { [key: string]: IconColor } = {
  warning: 'warn',
  info: 'primary',
  error: 'warn',
};

interface DialogConfirmData {
  title: string;
  message: string;
  buttons: DialogButton[];
  icon: DialogIcon;
}

interface DialogDetailFileData {
  title: string;
  name: string;
  fileType: string;
  created: Date;
  buttons: DialogButton[];
  icon: DialogIcon;
}


@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) { }

  openDialogConfirm(value: DialogConfirmData) {
    return this.dialog.open(DialogComponent, {
      data: {
        title: value.title,
        message: value.message,
        buttons: value.buttons,
        icon: value.icon,
        color: ICON_COLORS[value.icon],
        type: 'confirmation'
      },
      width: '300px'
    });
  }

  openDialogDetailFile(value: DialogDetailFileData) {
    return this.dialog.open(DialogComponent, {
      data: {
        title: value.title,
        name: value.name,
        fileType: value.fileType,
        created: value.created,
        buttons: value.buttons,
        icon: value.icon,
        color: ICON_COLORS[value.icon],
        type: 'detail-file'
      },
      width: '300px'
    });
  }
}
