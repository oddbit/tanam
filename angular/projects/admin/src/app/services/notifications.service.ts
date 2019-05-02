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

  getNofifications(): Observable<SystemNotification[]> {
    return this.siteCollection
      .collection<SystemNotification>('notifications', (ref) => ref.where('isRead', '==', false))
      .valueChanges();
  }
}
