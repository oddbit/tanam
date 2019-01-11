import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentSnapshot, QueryDocumentSnapshot } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

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
  fields: ContentTypeField[];
  numEntries: { [key: string]: number };
}

@Injectable({
  providedIn: 'root'
})
export class ContentTypeService {

  constructor(private readonly firestore: AngularFirestore) { }

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
