import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ContentTemplate, ContentType, SiteInfoSettings } from 'tanam-models';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {

  constructor(
    private readonly firestore: AngularFirestore,
  ) { }

  getTemplate(contentTypeId: string) {
    return this.firestore
      .collection('tanam-types').doc<ContentType>(contentTypeId)
      .valueChanges()
      .pipe(switchMap(type =>
        this.firestore
          .collection('tanam-templates').doc<ContentTemplate>(type.template)
          .valueChanges()));
  }

  getTemplates(): Observable<ContentTemplate[]> {
    return this.firestore
      .collection('tanam-settings').doc<SiteInfoSettings>('site')
      .valueChanges()
      .pipe(switchMap(settings =>
        this.firestore
          .collection<ContentTemplate>('tanam-templates', ref => ref.where('theme', '==', settings.theme))
          .valueChanges()));
  }
}
