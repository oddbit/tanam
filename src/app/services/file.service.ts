import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
export type FileType = 'image' | 'video' | 'pdf';

export interface TanamFile {
  id: string;
  createdAt: firebase.firestore.Timestamp | firebase.firestore.FieldValue;
  updatedAt: firebase.firestore.Timestamp | firebase.firestore.FieldValue;
  title: string;
  fileType: FileType;
  mimeType: string;
  url: string;
}


@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(
    private readonly firestore: AngularFirestore,
  ) { }

  getFiles(fileType: FileType) {
    return this.firestore
      .collection<TanamFile>('tanam-files', ref => ref.where('fileType', '==', fileType))
      .valueChanges();
  }
}
