import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

export interface ContentType {
  id: string;
  title: string;
  slug: string;
  numEntries: { [key: string]: number };
}

@Injectable({
  providedIn: 'root'
})
export class ContentTypeService {

  constructor(private readonly firestore: AngularFirestore) { }

  getContentTypes() {
    return this.firestore
      .collection('tanam-content')
      .snapshotChanges()
      .pipe(map(actions => actions.map(this.mergeDataWithId)));
  }

  getContentType(contentTypeId: string) {
    return this.firestore
      .collection('tanam-content').doc<ContentType>(contentTypeId)
      .snapshotChanges()
      .pipe(map(this.mergeDataWithId));
  }

  private mergeDataWithId(value) {
    const data = value.payload.doc.data();
    const id = value.payload.doc.id;
    return { id, ...data } as ContentType;
  }
}
