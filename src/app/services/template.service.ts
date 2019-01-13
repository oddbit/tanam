import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';

export interface ContentTemplate {
  title: string;
  html: string;
}

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  constructor(
    private readonly firestore: AngularFirestore,
  ) { }

  getTemplate(templateId: string) {
    console.log(`[TemplateService:getTemplate] ${templateId}`);
    return this.firestore.collection('tanam-templates').doc<ContentTemplate>(templateId).valueChanges();
  }
}
