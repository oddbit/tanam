import * as firebase from 'firebase/app';
import { Injectable } from '@angular/core';
import { AngularFirestore, CollectionReference, QueryDocumentSnapshot } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

export type ContentEntryStatus = 'published' | 'unpublished';

export interface ContentEntry {
  id?: string;
  title: string;
  slug: string;
  revision: number;
  status: ContentEntryStatus;
  tags: string[];
  publishTime?: Date | firebase.firestore.FieldValue;
  updatedAt: Date | firebase.firestore.FieldValue;
  createdAt: Date | firebase.firestore.FieldValue;
  data: any;
}

export interface ContentTypeQueryOptions {
  limit?: number;
  orderBy?: {
    field: string,
    sortOrder: 'asc' | 'desc',
  };
}

@Injectable({
  providedIn: 'root'
})
export class ContentEntryService {

  constructor(private readonly firestore: AngularFirestore) { }

  async createContentEntry(contentTypeId: string) {
    const entryId = this.firestore.createId();
    const docRef = this.firestore
      .collection('tanam-content').doc(contentTypeId)
      .collection<ContentEntry>('entries').doc(entryId);

    await docRef.set({
      data: {},
      tags: [],
      title: entryId,
      slug: entryId,
      revision: 0,
      status: 'unpublished',
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    } as ContentEntry);

    return docRef;
  }

  saveContentEntry(contentTypeId: string, entry: ContentEntry) {
    const docRef = this.firestore
      .collection('tanam-content').doc(contentTypeId)
      .collection<ContentEntry>('entries').doc(entry.id);

    entry.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
    entry.revision += 1;

    return docRef.set(entry);
  }

  getContentEntry(contentTypeId: string, entryId: string) {
    return this.firestore
      .collection('tanam-content').doc(contentTypeId)
      .collection('entries').doc<ContentEntry>(entryId)
      .snapshotChanges()
      .pipe(map(action => {
        return this.mergeDataWithId(action.payload);
      }));
  }

  getContentTypeEntries(contentTypeId: string, queryOpts?: ContentTypeQueryOptions) {
    console.log(`[ContentEntryService:getContentTypeFields] ${contentTypeId}: ${JSON.stringify(queryOpts)}`);
    return this.firestore
      .collection('tanam-content').doc(contentTypeId)
      .collection<ContentEntry>('entries', ref => this.applyQueryOpts(ref, queryOpts))
      .snapshotChanges()
      .pipe(map(actions => {
        return actions.map(action => {
          return this.mergeDataWithId(action.payload.doc);
        });
      }));
  }

  private applyQueryOpts(ref: CollectionReference, queryOpts?: ContentTypeQueryOptions) {
    if (queryOpts.orderBy) {
      ref.orderBy(queryOpts.orderBy.field, queryOpts.orderBy.sortOrder);
    }

    if (queryOpts.limit) {
      ref.limit(queryOpts.limit);
    }

    return ref;
  }


  private mergeDataWithId(doc: QueryDocumentSnapshot<ContentEntry>) {
    const data = doc.data();
    const id = doc.id;
    return { id, ...data } as ContentEntry;
  }
}
