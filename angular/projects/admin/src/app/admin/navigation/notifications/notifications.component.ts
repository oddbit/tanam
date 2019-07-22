import { Component, OnInit } from '@angular/core';
import { SystemNotification, SystemNotificationType } from 'tanam-models';
import { DialogService } from '../../../services/dialog.service';
import { NotificationsService } from '../../../services/notifications.service';

@Component({
  selector: 'tanam-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  notifications$ = this.notificationService.getNotifications();
  filterSelected = 'all';

  constructor(
    private readonly notificationService: NotificationsService,
    private readonly dialogService: DialogService,
  ) { }

  ngOnInit() {
  }

  readNotification(notification: SystemNotification) {
    console.log(`[readNotification] ${JSON.stringify(notification)}`);

    this.dialogService.openDialogConfirm({
      buttons: ['ok'],
      icon: notification.type === 'error' ? 'error' : 'info',
      message: notification.message,
      title: notification.title,
    })
    .afterOpened()
    .subscribe(() => this.notificationService.markNotificationAsRead(notification));
  }

  setColor (notificationType: SystemNotificationType) {
    return notificationType === 'error' ? 'warn' : 'accent';
  }

  setAlertText (notificationType: SystemNotificationType) {
    return notificationType === 'error' ? 'Warning' : 'Information';
  }

  setIcon (notificationType: SystemNotificationType) {
    return notificationType === 'error' ? 'error' : 'info';
  }

  async delete(event: Event, notificationId: string) {
    event.stopPropagation();
    await this.notificationService.delete(notificationId);
  }

  filterNotifications(event) {
    if (event.value === 'all') {
      this.notifications$ = this.notificationService.getNotifications();
    } else {
      this.notifications$ = this.notificationService.getUnreadNotifications();
    }
  }
}
