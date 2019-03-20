import { Injectable } from '@angular/core';
import { AngularFirestore, CollectionReference } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { Document, DocumentType } from 'tanam-models';
import { AppConfigService } from './app-config.service';
import * as moment from 'moment';

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
  readonly siteCollection = this.firestore.collection('tanam').doc(this.appConfig.siteId);

  constructor(
    private readonly firestore: AngularFirestore,
    private readonly appConfig: AppConfigService,
  ) { }

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
        url: `${documentType.slug}/${id}`,
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

    document.updated = firebase.firestore.FieldValue.serverTimestamp();
    return this.siteCollection
      .collection<Document>('documents').doc(document.id)
      .update(document);
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

  query(documentTypeId: string, queryOpts: DocumentTypeQueryOptions = {}): Observable<Document[]> {
    console.log(`[DocumentService:getDocumentTypeFields] ${documentTypeId}, query=${JSON.stringify(queryOpts)}`);

    const queryFn = (ref: CollectionReference) => {
      let query = ref.where('documentType', '==', documentTypeId);

      if (queryOpts.orderBy) {
        query = query.orderBy(queryOpts.orderBy.field, queryOpts.orderBy.sortOrder);
      }

      if (queryOpts.limit) {
        query = query.limit(queryOpts.limit);
      }

      return query;
    };

    return this.siteCollection
      .collection<Document>('documents', queryFn)
      .valueChanges();
  }
}
