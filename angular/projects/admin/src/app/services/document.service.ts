import { Injectable } from '@angular/core';
import { AngularFirestore, CollectionReference } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { Document, DocumentType } from 'tanam-models';
import { AppConfigService } from './app-config.service';
import { FirebaseApp } from '@angular/fire';

export interface DocumentTypeQueryOptions {
  limit?: number;
  orderBy?: {
    field: string,
    sortOrder: 'asc' | 'desc',
  };
}

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private lastDoc: any;
  private firstDoc = [];
  readonly siteCollection = this.firestore.collection('tanam').doc(this.appConfig.siteId);

  constructor(
    private readonly firebaseApp: FirebaseApp,
    private readonly firestore: AngularFirestore,
    private readonly appConfig: AppConfigService,
  ) { }

  private static _normalizeUrl(url: string): string {
    return `/${url}`.replace(/\/+/g, '/');
  }

  getNewId() {
    return this.firestore.createId();
  }

  async create(documentType: DocumentType, id: string = this.firestore.createId()) {
    return this.siteCollection
      .collection('documents').doc<Document>(id)
      .set({
        id: id,
        documentType: documentType.id,
        title: '',
        url: DocumentService._normalizeUrl(`/${documentType.slug}/${id}`),
        revision: 0,
        standalone: documentType.standalone,
        status: 'unpublished',
        data: {},
        tags: [],
        updated: firebase.firestore.FieldValue.serverTimestamp(),
        created: firebase.firestore.FieldValue.serverTimestamp(),
      } as Document);
  }

  update(document: Document) {
    if (!document.id) {
      throw new Error('Document ID must be provided as an attribute when updating an document.');
    }

    if (!document.published) {
      document.status = 'unpublished';
    } else if (document.published.toMillis() > Date.now()) {
      document.status = 'scheduled';
    } else {
      document.status = 'published';
    }

    document.url = DocumentService._normalizeUrl(document.url || '/');
    document.published = document.published || null;
    document.updated = firebase.firestore.FieldValue.serverTimestamp();
    document.revision = firebase.firestore.FieldValue.increment(1);

    if (document.data) {
      for (const key in document.data) {
        if (document.data[key] === undefined) {
          // Make sure that values are not accidentally of type undefined if not provided
          document.data[key] = null;
        }
      }
    }

    this.siteCollection.collection<Document>('documents').doc(document.id).update(document);
  }

  delete(documentId: string) {
    if (!documentId) {
      throw new Error('Document ID must be provided as an attribute when deleting an document.');
    }
    console.log(documentId);
    return this.siteCollection
      .collection<Document>('documents').doc(documentId)
      .delete();
  }

  get(documentId: string): Observable<Document> {
    return this.siteCollection
      .collection('documents').doc<Document>(documentId)
      .valueChanges();
  }

  query(
    documentTypeId: string, status: string, queryOpts: DocumentTypeQueryOptions = {}, nextPage?: Boolean, pageIndex?: number
  ): Observable<Document[]> {
    console.log(`[DocumentService:getDocumentTypeFields] ${documentTypeId}, query=${JSON.stringify(queryOpts)}`);

    console.log('[Next page] ', nextPage);
    console.log('[page index] ', pageIndex);

    if (pageIndex === 0) {
      this.firstDoc = [];
      this.lastDoc = '';
    }

    const queryFn = (ref: CollectionReference) => {
      let query = ref.where('documentType', '==', documentTypeId);
      if (status !== 'all') {
        query = query.where('status', '==', status);
      }

      if (queryOpts.orderBy) {
        query = query.orderBy(queryOpts.orderBy.field, queryOpts.orderBy.sortOrder);
      }

      if (!nextPage && this.firstDoc[this.firstDoc.length - 2]) { // back
        console.log('back');
        console.log(this.firstDoc[this.firstDoc.length - 2]);
        query = query.startAt(this.firstDoc[this.firstDoc.length - 2]);
        this.firstDoc.length = this.firstDoc.length - 1;
      }

      if (nextPage && this.lastDoc) { // next page
        console.log('last doc', this.lastDoc);
        query = query.startAfter(this.lastDoc);
      }

      if (queryOpts.limit) {
        query = query.limit(queryOpts.limit);
      }
      return query;
    };


    const ref = this.siteCollection
      .collection<Document>('documents', queryFn);

    ref.snapshotChanges().subscribe(res => {
      if (this.firstDoc.length === 0 || nextPage) {
        this.firstDoc.push(res[0].payload.doc);
      }
      this.lastDoc = res[res.length - 1].payload.doc;
      console.log(this.firstDoc);
    })

    return ref.valueChanges();
  }
}
