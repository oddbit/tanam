import { Injectable } from '@angular/core';
import { AngularFirestore, CollectionReference } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { DocumentStatus, ITanamDocument, TanamSite } from 'tanam-models';
import { SiteService } from './site.service';
import { map, switchMap, take } from 'rxjs/operators';
import { AngularTanamDocument } from '../app.models';

export interface DocumentTypeQueryOptions {
  limit?: number;
  orderBy?: {
    field: string,
    sortOrder: 'asc' | 'desc',
  };
  status?: DocumentStatus;
  startAfter?: firebase.firestore.DocumentSnapshot;
}

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  constructor(
    private readonly firestore: AngularFirestore,
    private readonly siteService: SiteService,
  ) {
  }

  async save(document: AngularTanamDocument) {
    const tanamSite = await this._currentSite;
    return this.firestore
      .collection('tanam').doc(tanamSite.id)
      .collection('documents').doc(document.id)
      .set(document.toJson());
  }

  async delete(documentId: string) {
    if (!documentId) {
      throw new Error('Document ID must be provided as an attribute when deleting an document.');
    }
    const doc = await this.firestore
      .collectionGroup<ITanamDocument>('documents', (ref) =>
        ref.where('id', '==', documentId).limit(1)
      )
      .snapshotChanges()
      .pipe(
        take(1),
        map((docs) => !!docs[0] ? docs[0].payload.doc : null),
      )
      .toPromise();


    return !!doc ? doc.ref.delete() : null;
  }

  get(documentId: string): Observable<AngularTanamDocument> {
    return this.siteService.getCurrentSite().pipe(
      switchMap((site) =>
        this.firestore
          .collection('tanam').doc(site.id)
          .collection('documents').doc<ITanamDocument>(documentId)
          .valueChanges()
          .pipe(map(data => new AngularTanamDocument(data))),
      )
    );
  }

  query(
    documentTypeId: string,
    queryOpts: DocumentTypeQueryOptions = {}
  ): Observable<ITanamDocument[]> {
    const queryFn = (ref: CollectionReference) => {
      let query = ref.where('documentType', '==', documentTypeId);
      if (queryOpts.status) {
        query = query.where('status', '==', queryOpts.status);
      }
      if (queryOpts.orderBy) {
        query = query.orderBy(queryOpts.orderBy.field, queryOpts.orderBy.sortOrder);
      }
      if (queryOpts.startAfter) {
        query = query.startAfter(queryOpts.startAfter);
      }
      if (queryOpts.limit) {
        query = query.limit(queryOpts.limit);
      }
      return query;
    };


    return this.siteService.getCurrentSite().pipe(
      switchMap((site) =>
        this.firestore
          .collection('tanam').doc(site.id)
          .collection<AngularTanamDocument>('documents', queryFn)
          .valueChanges()
          .pipe(map((docs) =>
            docs.map((doc) => new AngularTanamDocument(doc)))
          ),
      )
    );
  }

  async getReference(id: string) {
    const currentSite = await this._currentSite;
    return this.firestore
      .collection('tanam').doc(currentSite.id)
      .collection<ITanamDocument>('documents').doc(id)
      .ref.get();
  }


  get _currentSite(): Promise<TanamSite> {
    return this.siteService.getCurrentSite().pipe(take(1)).toPromise();
  }
}
