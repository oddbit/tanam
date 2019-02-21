import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { ThemeTemplate, Theme, DocumentType } from 'tanam-models';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeTemplateService {
  readonly siteCollection = this.firestore.collection('tanam').doc(this.appConfig.siteId);

  constructor(
    private readonly firestore: AngularFirestore,
    private readonly appConfig: AppConfigService,
  ) { }

  getTemplate(theme: string, template: string): Observable<ThemeTemplate> {
    return this.siteCollection
      .collection('themes').doc(theme)
      .collection('templates').doc<ThemeTemplate>(template)
      .valueChanges();
  }

  getTemplatesForTheme(theme: string) {
    return this.siteCollection
      .collection('themes').doc(theme)
      .collection<ThemeTemplate>('templates')
      .valueChanges();
  }

  async createTemplateInTheme(theme: Theme, documentType: DocumentType) {
    return this.siteCollection
      .collection('themes').doc(theme.id)
      .collection('templates').doc<ThemeTemplate>(documentType.id)
      .set({
        id: documentType.id,
        title: documentType.title,
        selector: `<${documentType.id}>`,
        template: '<!-- Put your HTML template here -->',
        styles: ['// Put your CSS template here'],
        updated: firebase.firestore.FieldValue.serverTimestamp(),
        created: firebase.firestore.FieldValue.serverTimestamp(),
      } as ThemeTemplate);
  }

  saveTemplate(template: ThemeTemplate) {
    return this.firestore.collection('templates').doc<ThemeTemplate>(template.id).update(template);
  }
}
