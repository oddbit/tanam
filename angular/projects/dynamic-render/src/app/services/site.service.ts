import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SiteInfoSettings } from 'tanam-core';

@Injectable({
  providedIn: 'root'
})
export class SiteService {

  constructor(
    private readonly firestore: AngularFirestore,
  ) { }

  getSiteName(): Observable<string> {
    return this.firestore
      .collection('tanam-settings').doc<SiteInfoSettings>('site')
      .valueChanges()
      .pipe(map(settings => settings.title));
  }


}
