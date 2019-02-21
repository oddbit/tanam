import { Injectable } from '@angular/core';
import { AngularFirestore, CollectionReference } from '@angular/fire/firestore';
import { combineLatest, Observable } from 'rxjs';
import { Document, SiteInformation, TanamDocumentContext } from 'tanam-models';
import { AppConfigService } from './app-config.service';

export interface DocumentQueryOptions {
  limit?: number;
  orderBy?: {
    field: string,
    sortOrder: 'asc' | 'desc',
  };
}

@Injectable({
  providedIn: 'root'
})
export class DocumentContextService {
  readonly siteCollection = this.firestore.collection('tanam').doc<SiteInformation>(this.appConfig.siteId);

  constructor(
    private readonly firestore: AngularFirestore,
    private readonly appConfig: AppConfigService,
  ) { }


  query(documentTypeId: string, queryOpts: DocumentQueryOptions = {}): Observable<TanamDocumentContext[]> {
    console.log(`[DocumentContextService:query] ${documentTypeId}, query=${JSON.stringify(queryOpts)}`);

    const queryFn = (ref: CollectionReference) => {
      let query = ref
        .where('documentType', '==', documentTypeId)
        .where('status', '==', 'published');

      if (queryOpts.orderBy) {
        if (!['asc', 'desc'].some(val => val === queryOpts.orderBy.sortOrder)) {
          // Sanitize the sort order value
          queryOpts.orderBy.sortOrder = 'desc';
        }

        query = query.orderBy(queryOpts.orderBy.field, queryOpts.orderBy.sortOrder);
      }

      if (queryOpts.limit) {
        query = query.limit(queryOpts.limit);
      }

      return query;
    };

    return combineLatest(
      this.siteCollection.valueChanges(),
      this.siteCollection.collection<Document>('documents', queryFn).valueChanges(),
      (siteInfo, docs) => docs.map(doc => this._toContext(siteInfo, doc)));
  }

  getById(documentId: string): Observable<TanamDocumentContext> {
    const queryFn = (ref: CollectionReference) => {
      return ref
        .where('id', '==', documentId)
        .where('status', '==', 'published')
        .limit(1);
    };

    return combineLatest(
      this.siteCollection.valueChanges(),
      this.siteCollection.collection<Document>('documents', queryFn).valueChanges(),
      (siteInfo, docs) => this._toContext(siteInfo, docs[0]));

  }

  getByUrl(root: string, path: string): Observable<TanamDocumentContext> {
    console.log(`[DocumentContextService:getByUrl] ${JSON.stringify({ root, path })}`);
    const queryFn = (ref: CollectionReference) =>
      ref.where('url.root', '==', root).where('url.path', '==', path).limit(1);


    return combineLatest(
      this.siteCollection.valueChanges(),
      this.siteCollection.collection<Document>('documents', queryFn).valueChanges(),
      (siteInfo, docs) => this._toContext(siteInfo, docs[0]));
  }

  private _toContext(siteInfo: SiteInformation, document: Document) {
    if (!document) {
      return null;
    }

    const context = {
      id: document.id,
      documentType: document.documentType,
      data: document.data,
      title: document.title,
      url: null,
      hostDomain: siteInfo.primaryDomain,
      hostUrl: `https://${siteInfo.primaryDomain}`,
      permalink: null,
      revision: document.revision,
      status: document.status,
      tags: document.tags,
      created: (document.created as firebase.firestore.Timestamp).toDate(),
      updated: (document.updated as firebase.firestore.Timestamp).toDate(),
      published: !!document.published
        ? (document.published as firebase.firestore.Timestamp).toDate()
        : null,
    } as TanamDocumentContext;

    if (document.standalone) {
      context.url = '/' + [document.url.root, document.url.path].filter(p => !!p).join('/');
      context.permalink = `${context.hostUrl}${context.url}`;
    }

    return context;
  }
}
