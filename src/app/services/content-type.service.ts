import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';

export type ContentTypeFieldFormElements = 'input-text'
  | 'input-number'
  | 'textbox-plain'
  | 'textbox-rich'
  | 'date'
  | 'time'
  | 'date-time'
  | 'slide-toggle';

export interface ContentTypeField {
  key: string;
  title: string;
  type: ContentTypeFieldFormElements;
}


export interface ContentTypeEntryCount {
  published: number;
  unpublished: number;
}

export interface ContentType {
  id: string; // Document id
  title: string; // Presentation name
  slug: string; // Root slug to group entries by
  template: string;
  standalone: boolean; // True if the content can be presented on a page with URL of its own
  description: string;
  icon: string; // Icon for menus etc
  fields: ContentTypeField[];
  numEntries: ContentTypeEntryCount;
  updatedAt: firebase.firestore.Timestamp | firebase.firestore.FieldValue;
  createdAt: firebase.firestore.Timestamp | firebase.firestore.FieldValue;
}

@Injectable({
  providedIn: 'root'
})
export class ContentTypeService {

  constructor(
    private readonly firestore: AngularFirestore,
    private readonly fbApp: FirebaseApp,
  ) { }


  getContentTypes() {
    return this.firestore
      .collection<ContentType>('tanam-types')
      .valueChanges();
  }

  getContentType(contentTypeId: string) {
    console.log(`getContentType contentType: ${contentTypeId}`);

    return this.firestore
      .collection('tanam-types').doc<ContentType>(contentTypeId)
      .valueChanges();
  }

  async createContentType(contentTypeName: string) {
    const typeId = this.firestore.createId();
    const doc = this.firestore.collection('tanam-types').doc(typeId);
    return this.fbApp.firestore().runTransaction<AngularFirestoreDocument>(async (trx) => {
      const trxDoc = await trx.get(doc.ref);
      if (!trxDoc.exists) {
        trx.set(doc.ref, {
          id: typeId,
          title: contentTypeName,
          slug: contentTypeName.toLowerCase().replace(' ', '-'),
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

      return doc;
    });
  }

  saveContentType(contentType: ContentType) {
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
