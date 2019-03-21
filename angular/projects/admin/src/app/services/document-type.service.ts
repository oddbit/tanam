import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { DocumentType, SiteInformation } from 'tanam-models';
import { AppConfigService } from './app-config.service';

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

  async create(title: string, slug: string) {
    const docRef = this.siteCollection.collection('document-types').doc(slug);
    return docRef.set({
      id: slug,
      title: title,
      description: '',
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

    console.log(`[DocumentTypeService:saveDocumentType] ${JSON.stringify(documentType, null, 2)}`);
    return doc.update(documentType);
  }
}
