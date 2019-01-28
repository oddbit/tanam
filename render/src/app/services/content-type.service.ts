import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { ContentType } from '../../../../models/content-type';

@Injectable({
  providedIn: 'root'
})
export class ContentTypeService {

  constructor(
    private readonly firestore: AngularFirestore,
    private readonly fbApp: FirebaseApp,
  ) { }


  getContentTypes(): Observable<ContentType[]> {
    return this.firestore
      .collection<ContentType>('tanam-types')
      .valueChanges();
  }

  getContentType(contentTypeId: string): Observable<ContentType> {
    console.log(`getContentType contentType: ${contentTypeId}`);

    return this.firestore
      .collection('tanam-types').doc<ContentType>(contentTypeId)
      .valueChanges();
  }


  async create(id: string = this.firestore.createId()) {
    const docRef = this.firestore.collection('tanam-types').doc(id);
    return docRef.set({
      id: id,
      title: null,
      slug: null,
      template: null,
      standalone: true,
      icon: 'cloud',
      fields: [],
      numEntries: {
        published: 0,
        unpublished: 0,
      },
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    } as ContentType);
  }

  save(contentType: ContentType) {
    const doc = this.firestore.collection('tanam-types').doc(contentType.id);
    contentType = {
      ...contentType,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    };

    console.log(`[ContentTypeService:saveContentType] ${JSON.stringify(contentType, null, 2)}`);
    return this.fbApp.firestore().runTransaction<void>(async (trx) => {
      trx.update(doc.ref, contentType);
    });
  }
}
