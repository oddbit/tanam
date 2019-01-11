import * as firebase from 'firebase/app';
import { Injectable } from '@angular/core';
import { AngularFirestore, CollectionReference, QueryDocumentSnapshot } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

export type ContentTypeEntryStatus = 'published' | 'unpublished';

export interface ContentTypeEntry {
  id?: string;
  title: string;
  slug: string;
  revision: number;
  status: ContentTypeEntryStatus;
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
export class ContentTypeEntryService {

  constructor(private readonly firestore: AngularFirestore) { }

  async createContentTypeEntry(contentTypeId: string) {
    const entryId = this.firestore.createId();
    const docRef = this.firestore
      .collection('tanam-content').doc(contentTypeId)
      .collection<ContentTypeEntry>('entries').doc(entryId);

    await docRef.set({
      data: {},
      tags: [],
      title: entryId,
      slug: entryId,
      revision: 0,
      status: 'unpublished',
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    } as ContentTypeEntry);

    return docRef;
  }

  saveContentTypeEntry(contentTypeId: string, entryId: string, entry: ContentTypeEntry) {
    const docRef = this.firestore
      .collection('tanam-content').doc(contentTypeId)
      .collection<ContentTypeEntry>('entries').doc(entryId);

    entry.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
    entry.revision += 1;

    return docRef.set(entry);
  }

  getContentTypeEntry(contentTypeId: string, entryId: string) {
    return this.firestore
      .collection('tanam-content').doc(contentTypeId)
      .collection('entries').doc<ContentTypeEntry>(entryId)
      .snapshotChanges()
      .pipe(map(action => {
        return this.mergeDataWithId(action.payload);
      }));
  }

  getContentTypeEntries(contentTypeId: string, queryOpts?: ContentTypeQueryOptions) {
    console.log(`[ContentTypeEntryService:getContentTypeFields] ${contentTypeId}: ${JSON.stringify(queryOpts)}`);
    return this.firestore
      .collection('tanam-content').doc(contentTypeId)
      .collection<ContentTypeEntry>('entries', ref => this.applyQueryOpts(ref, queryOpts))
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


  private mergeDataWithId(doc: QueryDocumentSnapshot<ContentTypeEntry>) {
    const data = doc.data();
    const id = doc.id;
    return { id, ...data } as ContentTypeEntry;
  }
}
