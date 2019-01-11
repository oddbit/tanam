import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { first } from 'rxjs/operators';

export interface ContentTypeField {
  key: string;
  title: string;
  order: string;
  type: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContentTypeFieldService {

  constructor(private readonly firestore: AngularFirestore) { }

  getContentTypeFields(contentTypeId: string) {
    return this.firestore
      .collection('tanam-content').doc(contentTypeId)
      .collection<ContentTypeField>('fields', ref => ref.orderBy('order', 'asc'))
      .valueChanges();
  }

  getContentTypeField(contentTypeId: string, key: string) {
    return this.firestore
      .collection('tanam-content').doc(contentTypeId)
      .collection<ContentTypeField>('fields', ref => ref.where('key', '==', key).limit(1))
      .valueChanges()
      .pipe(first());
  }
}
