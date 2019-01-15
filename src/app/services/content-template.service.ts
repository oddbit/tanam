import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

export interface ContentTemplate {
  id: string;
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

  getTemplate(templateId: string) {
    return this.firestore.collection('tanam-templates').doc<ContentTemplate>(templateId).valueChanges();
  }

  getTemplates() {
    return this.firestore.collection<ContentTemplate>('tanam-templates').valueChanges();
  }

  saveTemplate(template: ContentTemplate) {
    return this.firestore.collection('tanam-templates').doc<ContentTemplate>(template.id).update(template);
  }
}
