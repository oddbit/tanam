import { Injectable } from '@angular/core';
import { AngularFirestore, CollectionReference } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { FileType, TanamFile } from 'tanam-models';
import { AppConfigService } from './app-config.service';


export interface UserFileQueryOptions {
  limit?: number;
  orderBy?: {
    field: string,
    sortOrder: 'asc' | 'desc',
  };
  startAt?: firebase.firestore.DocumentSnapshot;
}

@Injectable({
  providedIn: 'root'
})
export class UserFileService {
  readonly siteCollection = this.firestore.collection('tanam').doc(this.appConfig.siteId);
  readonly siteStorage = this.fireStorage.ref(`/tanam/${this.appConfig.siteId}`);

  constructor(
    private readonly firestore: AngularFirestore,
    private readonly fireStorage: AngularFireStorage,
    private readonly appConfig: AppConfigService,
  ) { }

  getFile(id: string): Observable<TanamFile> {
    return this.siteCollection
      .collection('files').doc<TanamFile>(id)
      .valueChanges();
  }

  getFiles(fileType: FileType, queryOpts: UserFileQueryOptions): Observable<TanamFile[]> {
    const queryFn = (ref: CollectionReference) => {
      let query = ref.where('fileType', '==', fileType);
      if (queryOpts.orderBy) {
        query = query.orderBy(queryOpts.orderBy.field, queryOpts.orderBy.sortOrder);
      }

      if (queryOpts.limit) {
        query = query.limit(queryOpts.limit);
      }

      if (queryOpts.startAt) {
        query = query.startAfter(queryOpts.startAt);
      }

      return query;
    };
    return this.siteCollection.collection<TanamFile>('files', queryFn).valueChanges();
  }

  getDownloadUrl(file: TanamFile, variant?: 'large' | 'medium' | 'small'): Observable<string> {
    const filePath = !!variant ? file.variants[variant] : file.filePath;
    return this.fireStorage.ref(filePath).getDownloadURL();
  }

  upload(file: File): Observable<number> {
    const storageRef = this.siteStorage.child(`upload/${file.name}`);
    return storageRef.put(file).percentageChanges();
  }

  remove(file: TanamFile) {
    return this.siteCollection.collection('files').doc(file.id).delete().then(res => {
      console.log('File deleted');
    });
  }

  getReference(id: string) {
    if (!id) {
      return;
    }
    return this.siteCollection
      .collection('files').doc(id).ref.get();
  }
}
