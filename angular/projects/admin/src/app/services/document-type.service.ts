import { Injectable } from '@angular/core';
import { AngularFirestore, CollectionReference, Query } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { DocumentTypeQueryOptions, ITanamDocumentType, TanamSite } from 'tanam-models';
import { SiteService } from './site.service';
import { AngularTanamDocumentType } from '../app.models';
import { map, switchMap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DocumentTypeService {

  constructor(
    private readonly firestore: AngularFirestore,
    private readonly siteService: SiteService,
  ) {
  }

  async getReference(id: string) {
    const currentSite = await this._currentSite;
    return this.firestore
      .collection('tanam').doc(currentSite.id)
      .collection<ITanamDocumentType>('document-types').doc(id)
      .ref.get();
  }


  getDocumentTypes(queryOpts?: DocumentTypeQueryOptions): Observable<AngularTanamDocumentType[]> {
    const queryFn = (ref: CollectionReference) => {
      if (queryOpts) {
        let query: Query = ref;
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
      }
      return ref;
    };

    return this.siteService.getCurrentSite().pipe(
      switchMap((site) =>
        this.firestore
          .collection('tanam').doc(site.id)
          .collection<ITanamDocumentType>('document-types', queryFn)
          .valueChanges()
          .pipe(map((types) =>
            types.map((type) => new AngularTanamDocumentType(type)))
          ),
      )
    );
  }

  getDocumentType(documentTypeId: string): Observable<AngularTanamDocumentType> {
    console.log(`getDocumentType documentType: ${documentTypeId}`);

    return this.siteService.getCurrentSite().pipe(
      switchMap((site) =>
        this.firestore
          .collection('tanam').doc(site.id)
          .collection('document-types').doc<ITanamDocumentType>(documentTypeId)
          .valueChanges()
          .pipe(map(data => new AngularTanamDocumentType(data))),
      )
    );
  }

  async save(documentType: AngularTanamDocumentType) {
    const tanamSite = await this._currentSite;
    return this.firestore
      .collection('tanam').doc(tanamSite.id)
      .collection('document-types').doc(documentType.id)
      .set(documentType.toJson());
  }

  async delete(documentTypeId: string) {
    if (!documentTypeId) {
      throw new Error('Document ID must be provided as an attribute when deleting an document.');
    }

    const tanamSite = await this._currentSite;
    return this.firestore
      .collection('tanam').doc(tanamSite.id)
      .collection('document-types').doc(documentTypeId)
      .delete();
  }

  get _currentSite(): Promise<TanamSite> {
    return this.siteService.getCurrentSite().pipe(take(1)).toPromise();
  }
}
