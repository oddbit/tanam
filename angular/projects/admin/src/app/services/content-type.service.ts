import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { DocumentType, SiteInformation } from 'tanam-models';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root'
})
export class ContentTypeService {
  readonly siteCollection = this.firestore.collection('tanam').doc<SiteInformation>(this.appConfig.siteId);

  constructor(
    private readonly firestore: AngularFirestore,
    private readonly appConfig: AppConfigService,
  ) { }


  getContentTypes(): Observable<DocumentType[]> {
    return this.siteCollection
      .collection<DocumentType>('document-types')
      .valueChanges();
  }

  getContentType(documentTypeId: string): Observable<DocumentType> {
    console.log(`getContentType documentType: ${documentTypeId}`);

    return this.siteCollection
      .collection('document-types').doc<DocumentType>(documentTypeId)
      .valueChanges();
  }

  async create(id: string) {
    const docRef = this.siteCollection.collection('document-types').doc(id);
    return docRef.set({
      id: id,
      title: null,
      slug: null,
      template: null,
      standalone: true,
      icon: 'cloud',
      fields: [],
      numEntries: {
        published: 0,
        unpublished: 0,
      },
      updated: firebase.firestore.FieldValue.serverTimestamp(),
      created: firebase.firestore.FieldValue.serverTimestamp(),
    } as DocumentType);
  }

  save(documentType: DocumentType) {
    const doc = this.siteCollection.collection('document-types').doc(documentType.id);
    documentType = {
      ...documentType,
      updated: firebase.firestore.FieldValue.serverTimestamp(),
    };

    console.log(`[ContentTypeService:saveContentType] ${JSON.stringify(documentType, null, 2)}`);
    return doc.update(documentType);
  }
}
