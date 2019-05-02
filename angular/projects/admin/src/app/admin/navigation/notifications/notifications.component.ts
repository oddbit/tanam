import { Component, OnInit } from '@angular/core';
import { SystemNotification } from 'tanam-models';
import { DialogConfirmService } from '../../../services/dialogConfirm.service';
import { NotificationsService } from '../../../services/notifications.service';

@Component({
  selector: 'tanam-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  notifications$ = this.notificationService.getNofifications();

  constructor(
    private readonly notificationService: NotificationsService,
    private readonly dialogConfirmService: DialogConfirmService,
  ) { }

  ngOnInit() {
  }

  readNotification(notification: SystemNotification) {
    console.log(`[readNotification] ${JSON.stringify(notification)}`);

    this.dialogConfirmService.openDialogConfirm({
      buttons: ['ok'],
      icon: notification.type === 'error' ? 'error' : 'info',
      message: notification.message,
      title: notification.title,
    })
    .afterOpened()
    .subscribe(() => this.notificationService.markNotificationAsRead(notification));
  }
}
