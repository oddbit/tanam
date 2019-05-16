import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { DocumentType, SiteInformation } from 'tanam-models';
import { AppConfigService } from './app-config.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DocumentTypeService {
  readonly siteCollection = this.firestore.collection('tanam').doc<SiteInformation>(this.appConfig.siteId);

  constructor(
    private readonly firestore: AngularFirestore,
    private readonly appConfig: AppConfigService,
  ) { }


  getDocumentTypes(): Observable<DocumentType[]> {
    return this.siteCollection
      .collection<DocumentType>('document-types')
      .valueChanges();
  }

  getDocumentType(documentTypeId: string): Observable<DocumentType> {
    console.log(`getDocumentType documentType: ${documentTypeId}`);

    return this.siteCollection
      .collection('document-types').doc<DocumentType>(documentTypeId)
      .valueChanges();
  }

  async createWithTitle(id: string, title: string) {
    const docRef = this.siteCollection.collection('document-types').doc(id);
    return docRef.set({
      id: id,
      title: title,
      description: '',
      slug: id,
      template: null,
      standalone: true,
      icon: 'cloud',
      fields: [],
      documentCount: {
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

    console.log(`[DocumentTypeService:saveDocumentType] ${JSON.stringify(documentType, null, 2)}`);
    return doc.update(documentType);
  }

  delete(documentTypeId: string) {
    if (!documentTypeId) {
      throw new Error('Document ID must be provided as an attribute when deleting an document.');
    }
    console.log(documentTypeId);
    return this.siteCollection
      .collection<Document>('document-types').doc(documentTypeId)
      .delete();
  }
}
