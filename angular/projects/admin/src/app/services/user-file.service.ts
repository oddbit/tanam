import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { FileType, TanamFile } from 'tanam-models';
import { AppConfigService } from './app-config.service';
import { distinct } from 'rxjs/operators';


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

  getDownloadUrl(storagePath: string) {
    return this.fireStorage.ref(storagePath).getDownloadURL();
  }

  getFile(id: string): Observable<TanamFile> {
    return this.siteCollection
      .collection('files').doc<TanamFile>(id)
      .valueChanges();
  }

  getFiles(fileType: FileType): Observable<TanamFile[]> {
    return this.siteCollection
      .collection<TanamFile>('files', ref => ref.where('fileType', '==', fileType))
      .valueChanges();
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
    return this.siteCollection.collection('files').doc(file.id).delete();
  }
}
