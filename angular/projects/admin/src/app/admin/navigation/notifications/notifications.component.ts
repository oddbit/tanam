import { Component, OnInit } from '@angular/core';
import { SystemNotification, SystemNotificationType } from 'tanam-models';
import { DialogConfirmService } from '../../../services/dialogConfirm.service';
import { NotificationsService } from '../../../services/notifications.service';

@Component({
  selector: 'tanam-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  notifications$ = this.notificationService.getNofifications();
  readonly filterSelected = 'all';

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
      this.notifications$ = this.notificationService.getNofifications();
    } else {
      this.notifications$ = this.notificationService.getUnreadNofifications();
    }
  }
}
