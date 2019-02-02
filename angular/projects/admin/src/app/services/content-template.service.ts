import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { ContentTemplate, TanamTheme } from 'tanam-models';

@Injectable({
  providedIn: 'root'
})
export class ContentTemplateService {

  constructor(
    private readonly firestore: AngularFirestore,
  ) { }

  getTemplate(templateId: string): Observable<ContentTemplate> {
    return this.firestore
      .collection('tanam-templates').doc<ContentTemplate>(templateId)
      .valueChanges();
  }

  getTemplatesForTheme(themeId: string) {
    return this.firestore
      .collection<ContentTemplate>('tanam-templates', ref => ref.where('theme', '==', themeId))
      .valueChanges();
  }

  async createTemplateInTheme(theme: TanamTheme) {
    const id = this.firestore.createId();
    const doc = this.firestore.collection('tanam-templates').doc<ContentTemplate>(id);
    doc.set({
      id: id,
      theme: theme.id,
      title: '',
      selector: '',
      template: '<!-- Put your HTML template here -->',
      styles: ['// Put your CSS template here'],
      updated: firebase.firestore.FieldValue.serverTimestamp(),
      created: firebase.firestore.FieldValue.serverTimestamp(),
    } as ContentTemplate);

    return id;
  }

  saveTemplate(template: ContentTemplate) {
    return this.firestore.collection('tanam-templates').doc<ContentTemplate>(template.id).update(template);
  }
}
