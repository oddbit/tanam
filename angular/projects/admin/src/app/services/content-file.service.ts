import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { FileType, MIME_TYPE_ENDING_MAP, TanamFile } from 'tanam-models';
import { AppConfigService } from './app-config.service';


@Injectable({
  providedIn: 'root'
})
export class ContentFileService {
  readonly siteCollection = this.firestore.collection('tanam').doc(this.appConfig.siteId);

  constructor(
    private readonly firestore: AngularFirestore,
    private readonly fireStorage: AngularFireStorage,
    private readonly appConfig: AppConfigService,
  ) { }

  getFiles(fileType: FileType): Observable<TanamFile[]> {
    return this.siteCollection
      .collection<TanamFile>('files', ref => ref.where('fileType', '==', fileType))
      .valueChanges();
  }

  upload(file: File): Observable<number> {
    const fileId = this.firestore.createId();
    const fileName = file.name;
    const fileType = this.fileTypeFrom(file);
    const fileEnding = MIME_TYPE_ENDING_MAP[file.type] || file.name.substr(file.name.lastIndexOf('.') + 1).toLowerCase();
    const storageRef = this.fireStorage.ref(`/tanam/${fileType}/${fileId}.${fileEnding}`);
    const uploadTask: AngularFireUploadTask = storageRef.put(file);

    uploadTask.then(async (snapshot) => {
      if (snapshot.state !== 'success') {
        console.error(`[FileService:upload] ${snapshot.state}`);
        return;
      }

      const downloadURL = await snapshot.ref.getDownloadURL();
      const tanamFile: TanamFile = {
        id: fileId,
        title: fileName,
        bucket: snapshot.metadata.bucket,
        filePath: snapshot.metadata.fullPath,
        updated: firebase.firestore.FieldValue.serverTimestamp(),
        created: firebase.firestore.FieldValue.serverTimestamp(),
        bytes: snapshot.totalBytes,
        variants: {},
        mimeType: snapshot.metadata.contentType,
        fileType: fileType,
        url: downloadURL,
      };

      this.siteCollection
        .collection<TanamFile>('files').doc(fileId)
        .set(tanamFile);
    });

    return uploadTask.percentageChanges();
  }

  private fileTypeFrom(file: File): FileType {
    switch (file.type.split('/')[0]) {
      case 'image':
        return 'image';
      default:
        return 'document';
    }
  }
}
