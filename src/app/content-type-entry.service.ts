import { Injectable } from '@angular/core';
import { AngularFirestore, CollectionReference } from '@angular/fire/firestore';

export interface ContentTypeEntry {
  title: string;
  url: string;
  urls: string[];
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

  getContentTypeFields(contentTypeId: string, queryOpts?: ContentTypeQueryOptions) {
    return this.firestore
      .collection('tanam-content').doc(contentTypeId)
      .collection<ContentTypeEntry>('entries', ref => this.applyQueryOpts(ref, queryOpts))
      .valueChanges();
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
}
