import { Injectable } from '@angular/core';
import { AngularFirestore, CollectionReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ContentEntry } from 'tanam-models';
import { TanamDocumentContext } from '../models/dynamic-page.models';

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

  constructor(
    private readonly firestore: AngularFirestore,
  ) { }


  query(contentTypeId: string, queryOpts: DocumentQueryOptions = {}): Observable<TanamDocumentContext[]> {
    console.log(`[ContentEntryService:getContentTypeFields] ${contentTypeId}, query=${JSON.stringify(queryOpts)}`);

    const queryFn = (ref: CollectionReference) => {
      let query = ref
        .where('contentType', '==', contentTypeId)
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

    return this.firestore
      .collection<ContentEntry>('tanam-entries', queryFn)
      .valueChanges()
      .pipe(map(docs => docs.map(doc => this._toContext(doc))));
  }

  getById(entryId: string): Observable<TanamDocumentContext> {
    const queryFn = (ref: CollectionReference) => {
      return ref
        .where('id', '==', entryId)
        .where('status', '==', 'published')
        .limit(1);
    };

    return this.firestore
      .collection('tanam-entries', queryFn)
      .valueChanges()
      .pipe(map(docs => docs[0] as ContentEntry))
      .pipe(map(doc => this._toContext(doc)));
  }

  getByUrl(root: string, path: string): Observable<TanamDocumentContext> {
    console.log(`[ContentEntryService:findContentEntryByUrl] ${JSON.stringify({ root, path })}`);

    const queryFn = (ref: CollectionReference) =>
      ref.where('url.root', '==', root).where('url.path', '==', path).limit(1);

    return this.firestore
      .collection<ContentEntry>('tanam-entries', queryFn)
      .valueChanges()
      .pipe(map(doc => doc[0]))
      .pipe(map(doc => this._toContext(doc)));
  }

  private _toContext(contentEntry: ContentEntry) {
    return !contentEntry ? null : {
      id: contentEntry.id,
      contentType: contentEntry.contentType,
      data: contentEntry.data,
      title: contentEntry.title,
      url: contentEntry.standalone
        ? '/' + [contentEntry.url.root, contentEntry.url.path].filter(p => !!p).join('/')
        : null,
      revision: contentEntry.revision,
      status: contentEntry.status,
      tags: contentEntry.tags,
      created: (contentEntry.created as firebase.firestore.Timestamp).toDate(),
      updated: (contentEntry.updated as firebase.firestore.Timestamp).toDate(),
      published: !!contentEntry.published
        ? (contentEntry.published as firebase.firestore.Timestamp).toDate()
        : null,
    } as TanamDocumentContext;
  }
}
