import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire';
import { AngularFirestore, CollectionReference } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { map } from 'rxjs/operators';
import { ContentType } from './content-type.service';

export type ContentEntryStatus = 'published' | 'unpublished' | 'deleted';

export interface ContentEntry {
  id: string; // Document id
  contentType: string;
  data: { [key: string]: any }; // The content data to render into templates
  title: string;  // Presentation title for browser window title and content listings
  url: {
    root: string, // The entry path root
    path: string, // The entry URL
  };
  revision: number; // Constantly increasing
  status: ContentEntryStatus;
  tags: string[];
  publishTime?: firebase.firestore.Timestamp | firebase.firestore.FieldValue;
  updatedAt: firebase.firestore.Timestamp | firebase.firestore.FieldValue;
  createdAt: firebase.firestore.Timestamp | firebase.firestore.FieldValue;
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

  constructor(
    private readonly fbApp: FirebaseApp,
    private readonly firestore: AngularFirestore,
  ) { }

  async createContentEntry(contentType: ContentType) {
    const entryId = this.firestore.createId();
    const docRef = this.firestore.collection<ContentEntry>('tanam-entries').doc(entryId);

    await docRef.set({
      id: entryId,
      contentType: contentType.id,
      title: entryId,
      url: {
        root: contentType.slug,
        path: entryId,
      },
      revision: 0,
      status: 'unpublished',
      data: {},
      tags: [],
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    } as ContentEntry);

    return docRef;
  }

  saveContentEntry(entry: ContentEntry) {
    const docRef = this.firestore.collection<ContentEntry>('tanam-entries').doc(entry.id);
    entry.updatedAt = firebase.firestore.FieldValue.serverTimestamp();

    return this.fbApp.firestore().runTransaction<void>(async (trx) => {
      const trxDoc = await trx.get(docRef.ref);
      const trxEntry = trxDoc.data() as ContentEntry;

      entry.revision = trxEntry.revision + 1;

      trx.update(docRef.ref, entry);
    });
  }

  findContentEntryByUrl(root: string, path: string) {
    console.log(`[ContentEntryService:findContentEntryByUrl] ${JSON.stringify({ root, path })}`);

    const queryFn = (ref: CollectionReference) =>
      ref.where('url.root', '==', root).where('url.path', '==', path).limit(1);

    return this.firestore
      .collection<ContentEntry>('tanam-entries', queryFn)
      .valueChanges()
      .pipe(map(entry => entry[0]));
  }

  getContentEntry(entryId: string) {
    return this.firestore
      .collection('tanam-entries').doc<ContentEntry>(entryId)
      .valueChanges();
  }

  getContentEntries(contentTypeId: string, queryOpts: ContentTypeQueryOptions = {}) {
    console.log(`[ContentEntryService:getContentTypeFields] ${contentTypeId}: ${JSON.stringify(queryOpts)}`);

    const queryFn = (ref: CollectionReference) => {
      ref.where('contentType', '==', contentTypeId);

      if (queryOpts.orderBy) {
        ref.orderBy(queryOpts.orderBy.field, queryOpts.orderBy.sortOrder);
      }

      if (queryOpts.limit) {
        ref.limit(queryOpts.limit);
      }

      return ref;
    };

    return this.firestore
      .collection<ContentEntry>('tanam-entries', queryFn)
      .valueChanges();
  }
}
