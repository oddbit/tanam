import * as firebase from 'firebase/app';
import { Injectable } from '@angular/core';
import { AngularFirestore, QueryDocumentSnapshot, AngularFirestoreDocument, CollectionReference } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { FirebaseApp } from '@angular/fire';
import { UrlSegment } from '@angular/router';

export type ContentTypeFieldFormElements = 'text-line' | 'text-area' | 'html' | 'number' | 'date' | 'slide-toggle';
export interface ContentTypeField {
  key: string;
  title: string;
  type: ContentTypeFieldFormElements;
}

export interface ContentType {
  id?: string; // Document id
  title: string; // Presentation name
  slug: string; // Root slug to group entries by
  template: string;
  description?: string;
  icon: string; // Icon for menus etc
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

  async createContentType(contentTypeId: string) {
    const contentTypeDocument = this.firestore.collection('tanam-content-types').doc(contentTypeId);
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

  async findContentTypeByUrl(urlSegments: UrlSegment[]) {
    const fullPath = urlSegments.map(segment => segment.path).join('/');
    const contentTypeslug = urlSegments[0] || '';
    const contentEntryPath = urlSegments.slice(1).map(segment => segment.path).join('/');

    console.log(`[ContentTypeService:findContentTypeByUrl] ${fullPath}`);

    const contentTypes = await this.firestore
      .collection<ContentType>('tanam-content-types')
      .snapshotChanges()
      .pipe(map(actions => {
        return actions.map(action => {
          return this.mergeDataWithId(action.payload.doc);
        });
      }))
      .toPromise();

    for (const contentType of contentTypes.filter(ct => !ct.slug || ct.slug === contentTypeslug)) {
      // Search across all content types that either match the prefixed path or doesn't have a prefix (e.g. pages)
      console.log(`[ContentTypeService:findContentTypeByUrl] Query entries in: ${contentType.id}`);
      const queryFn = !!contentType.slug
        ? (ref: CollectionReference) => ref.where('path', '==', contentEntryPath)
        : (ref: CollectionReference) => ref.where('path', '==', fullPath);

      const entries = await this.firestore
        .collection<ContentType>('tanam-content-types').doc(contentType.id)
        .collection<string>('tanam-content-entries', queryFn)
        .snapshotChanges()
        .pipe(map(actions => actions.map(action => action.payload.doc.id)))
        .toPromise();

      if (entries.length > 0) {
        console.log(`[ContentTypeService:findContentTypeByUrl] ${contentType.id}/${entries[0]} -> ${fullPath}`);
        return this.firestore.collection<ContentType>('tanam-content-types').doc(contentType.id);
      }
    }
  }

  getContentTypes() {
    return this.firestore
      .collection<ContentType>('tanam-content-types')
      .snapshotChanges()
      .pipe(map(actions => {
        return actions.map(action => {
          return this.mergeDataWithId(action.payload.doc);
        });
      }));
  }

  getContentType(contentTypeId: string) {
    return this.firestore
      .collection('tanam-content-types').doc<ContentType>(contentTypeId)
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
