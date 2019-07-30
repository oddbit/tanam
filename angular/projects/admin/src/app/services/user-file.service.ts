import { Injectable } from '@angular/core';
import { AngularFirestore, CollectionReference } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { FileType, MediaFilesQueryOptions, TanamFile, TanamSite } from 'tanam-models';
import { SiteService } from './site.service';
import { switchMap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserFileService {
  constructor(
    private readonly firestore: AngularFirestore,
    private readonly fireStorage: AngularFireStorage,
    private readonly siteService: SiteService,
  ) {
  }

  getFile(id: string): Observable<TanamFile> {
    return this.siteService.getCurrentSite().pipe(
      switchMap((site) =>
        this.firestore
          .collection('tanam').doc(site.id)
          .collection('files').doc<TanamFile>(id)
          .valueChanges()
      ),
    );
  }

  getFiles(fileType: FileType, queryOpts?: MediaFilesQueryOptions): Observable<TanamFile[]> {
    const queryFn = (ref: CollectionReference) => {
      if (queryOpts) {
        let query = ref.where('fileType', '==', fileType);
        if (queryOpts.orderBy) {
          query = query.orderBy(queryOpts.orderBy.field, queryOpts.orderBy.sortOrder);
        }
        if (queryOpts.limit) {
          query = query.limit(queryOpts.limit);
        }
        if (queryOpts.startAfter) {
          query = query.startAfter(queryOpts.startAfter);
        }
        return query;
      }
      return ref;
    };

    return this.siteService.getCurrentSite().pipe(
      switchMap((site) =>
        this.firestore
          .collection('tanam').doc(site.id)
          .collection<TanamFile>('files', queryFn)
          .valueChanges()
      ),
    );
  }

  getDownloadUrl(file: TanamFile, variant?: 'large' | 'medium' | 'small'): Observable<string> {
    const filePath = !!variant ? file.variants[variant] : file.filePath;
    return this.fireStorage.ref(filePath).getDownloadURL();
  }

  upload(file: File) {
    return this.siteService.getCurrentSite().pipe(
      switchMap((site) =>
        this.fireStorage
          .ref(`/tanam/${site.id}`)
          .child(`upload/${file.name}`)
          .put(file)
          .percentageChanges()
      )
    );
  }

  async remove(file: TanamFile) {
    const tanamSite = await this._currentSite;
    return this.firestore
      .collection('tanam').doc(tanamSite.id)
      .collection('files').doc(file.id)
      .delete();
  }

  async getReference(id: string) {
    const tanamSite = await this._currentSite;
    return this.firestore
      .collection('tanam').doc(tanamSite.id)
      .collection('files').doc<TanamFile>(id).ref.get();
  }

  get _currentSite(): Promise<TanamSite> {
    return this.siteService.getCurrentSite().pipe(take(1)).toPromise();
  }
}
