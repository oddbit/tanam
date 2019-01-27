import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { TanamTheme } from './theme.service';

export interface ContentTemplate {
  id: string;
  theme: string;
  title: string;
  selector: string;
  template: string;
  styles: string[];
  createdAt: firebase.firestore.Timestamp | firebase.firestore.FieldValue;
  updatedAt: firebase.firestore.Timestamp | firebase.firestore.FieldValue;
}

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

  getTemplates(theme: string) {
    return this.firestore
      .collection<ContentTemplate>('tanam-templates', ref => ref.where('theme', '==', theme))
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
      styles: [''],
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    } as ContentTemplate);

    return id;
  }

  saveTemplate(template: ContentTemplate) {
    return this.firestore.collection('tanam-templates').doc<ContentTemplate>(template.id).update(template);
  }
}
