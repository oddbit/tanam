import * as firebase from 'firebase/app';
import { Injectable } from '@angular/core';
import { AngularFirestore, QueryDocumentSnapshot, AngularFirestoreDocument } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { FirebaseApp } from '@angular/fire';

export type ContentTypeFieldFormElements = 'text-line' | 'text-area' | 'number' | 'datepicker' | 'slide-toggle';
export interface ContentTypeField {
  key: string;
  title: string;
  type: ContentTypeFieldFormElements;
}

export interface ContentType {
  id: string;
  title: string;
  slug: string;
  description?: string;
  icon: string;
  fields: ContentTypeField[];
  numEntries: { [key: string]: number };
  updatedAt: Date | firebase.firestore.FieldValue;
  createdAt: Date | firebase.firestore.FieldValue;
}

@Injectable({
  providedIn: 'root'
})
export class ContentTypeService {

  constructor(
    private readonly firestore: AngularFirestore,
    private readonly fbApp: FirebaseApp,
  ) { }

  async createContentEntry(contentTypeId: string) {
    const contentTypeDocument = this.firestore.collection('tanam-content').doc(contentTypeId);
    return this.fbApp.firestore()
      .runTransaction<AngularFirestoreDocument>(async (trx) => {
        const doc = await trx.get(contentTypeDocument.ref);
        if (!doc.exists) {
          trx.set(contentTypeDocument.ref, {
            title: contentTypeId,
            slug: contentTypeId,
            icon: 'cloud',
            fields: [],
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          } as ContentType);
        }

        return contentTypeDocument;
      });
  }

  getContentTypes() {
    return this.firestore
      .collection<ContentType>('tanam-content')
      .snapshotChanges()
      .pipe(map(actions => {
        return actions.map(action => {
          return this.mergeDataWithId(action.payload.doc);
        });
      }));
  }

  getContentType(contentTypeId: string) {
    return this.firestore
      .collection('tanam-content').doc<ContentType>(contentTypeId)
      .snapshotChanges()
      .pipe(map(action => {
        return this.mergeDataWithId(action.payload);
      }));
  }

  private mergeDataWithId(doc: QueryDocumentSnapshot<ContentType>) {
    const data = doc.data();
    const id = doc.id;
    return { id, ...data } as ContentType;
  }
}
