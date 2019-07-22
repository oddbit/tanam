import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { SystemNotification, TanamSite } from 'tanam-models';
import { switchMap, take } from 'rxjs/operators';
import { SiteService } from './site.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(
    private readonly firestore: AngularFirestore,
    private readonly siteService: SiteService,
  ) {
  }

  getUnreadNotifications(): Observable<SystemNotification[]> {
    return this.siteService.getCurrentSite().pipe(
      switchMap((site) =>
        this.firestore
          .collection('tanam').doc(site.id)
          .collection<SystemNotification>('notifications', (ref) => ref
            .where('isRead', '==', false)
            .orderBy('updated', 'desc')
          )
          .valueChanges()
      )
    );
  }

  getNotifications(): Observable<SystemNotification[]> {
    return this.siteService.getCurrentSite().pipe(
      switchMap((site) =>
        this.firestore
          .collection('tanam').doc(site.id)
          .collection<SystemNotification>('notifications', (ref) => ref
            .orderBy('updated', 'desc')
          )
          .valueChanges()
      )
    );
  }

  async markNotificationAsRead(notification: SystemNotification) {
    const tanamSite = await this._currentSite;
    return this.firestore
      .collection('tanam').doc(tanamSite.id)
      .collection<SystemNotification>('notifications').doc(notification.id)
      .update({isRead: true});
  }

  async delete(notificationId: string) {
    if (!notificationId) {
      throw new Error('Notification ID must be provided as an attribute when deleting.');
    }
    console.log(notificationId);
    const tanamSite = await this._currentSite;
    return this.firestore
      .collection('tanam').doc(tanamSite.id)
      .collection<SystemNotification>('notifications').doc(notificationId)
      .delete();
  }

  get _currentSite(): Promise<TanamSite> {
    return this.siteService.getCurrentSite().pipe(take(1)).toPromise();
  }
}
