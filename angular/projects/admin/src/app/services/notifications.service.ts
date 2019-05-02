import { Injectable } from '@angular/core';
import { AppConfigService } from './app-config.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { SystemNotification } from 'tanam-models';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  readonly siteCollection = this.firestore.collection('tanam').doc(this.appConfig.siteId);

  constructor(
    private readonly firestore: AngularFirestore,
    private readonly appConfig: AppConfigService,
  ) { }

  getUnreadNofifications(): Observable<SystemNotification[]> {
    return this.siteCollection
      .collection<SystemNotification>('notifications', (ref) => ref.where('isRead', '==', false).orderBy('created', 'desc'))
      .valueChanges();
  }

  getNofifications(): Observable<SystemNotification[]> {
    return this.siteCollection
      .collection<SystemNotification>('notifications', (ref) => ref.orderBy('created', 'desc'))
      .valueChanges();
  }

  markNotificationAsRead(notificationId: string) {
    return this.siteCollection
      .collection<SystemNotification>('notifications').doc(notificationId)
      .update({ isRead: true });
  }

  delete(notificationId: string) {
    if (!notificationId) {
      throw new Error('Notification ID must be provided as an attribute when deleting.');
    }
    console.log(notificationId);
    return this.siteCollection
      .collection<SystemNotification>('notifications').doc(notificationId)
      .delete();
  }
}
