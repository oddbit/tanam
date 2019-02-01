import { Injectable } from '@angular/core';
import { AngularFirestore, CollectionReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ContentEntry } from 'tanam-core';
import { map } from 'rxjs/operators';

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
export class PublishedDocumentService {

  constructor(
    private readonly firestore: AngularFirestore,
  ) { }

  getById(entryId: string): Observable<ContentEntry> {
    const queryFn = (ref: CollectionReference) => {
      return ref
        .where('id', '==', entryId)
        .where('status', '==', 'published')
        .limit(1);
    };

    return this.firestore
      .collection('tanam-entries', queryFn)
      .valueChanges()
      .pipe(map(docs => docs[0] as ContentEntry));
  }

  query(contentTypeId: string, queryOpts: DocumentQueryOptions = {}): Observable<ContentEntry[]> {
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
      .valueChanges();
  }
}
