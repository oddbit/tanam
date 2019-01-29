import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { FileType, MIME_TYPE_ENDING_MAP, TanamFile } from '../models/file.models';


@Injectable({
  providedIn: 'root'
})
export class ContentFileService {

  constructor(
    private readonly firestore: AngularFirestore,
    private readonly fireStorage: AngularFireStorage,
  ) { }

  getFiles(fileType: FileType): Observable<TanamFile[]> {
    return this.firestore
      .collection<TanamFile>('tanam-files', ref => ref.where('fileType', '==', fileType))
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
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        bytes: snapshot.totalBytes,
        mimeType: snapshot.metadata.contentType,
        fileType: fileType,
        url: downloadURL,
      };

      this.firestore
      .collection<TanamFile>('tanam-files').doc(fileId)
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
