import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SiteInformation } from 'tanam-models';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root'
})
export class SiteService {
  readonly siteCollection = this.firestore.collection('tanam').doc<SiteInformation>(this.appConfig.siteId);

  constructor(
    private readonly firestore: AngularFirestore,
    private readonly appConfig: AppConfigService,
  ) { }


  getSiteName(): Observable<string> {
    return this.siteCollection.valueChanges().pipe(map(settings => settings.title));
  }
}
