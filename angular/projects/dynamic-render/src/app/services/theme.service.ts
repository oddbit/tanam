import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { SiteInfoSettings, TanamTheme } from 'tanam-models';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor(
    private readonly firestore: AngularFirestore,
  ) { }

  getCurrentTheme(): Observable<TanamTheme> {
    return this.firestore
      .collection('tanam-settings').doc<SiteInfoSettings>('site')
      .valueChanges()
      .pipe(switchMap(settings =>
        this.firestore
          .collection('tanam-themes').doc<TanamTheme>(settings.theme)
          .valueChanges()));
  }
}
