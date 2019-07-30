import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { TanamFile } from 'tanam-models';
import { UserFileService } from '../../../../services/user-file.service';
import { tap, map } from 'rxjs/operators';
import { IPageInfo } from 'ngx-virtual-scroller';

@Component({
  selector: 'tanam-file-picker-dialog',
  templateUrl: './file-picker-dialog.component.html',
  styleUrls: ['./file-picker-dialog.component.scss']
})
export class FilePickerDialogComponent {
  uploadTasks: { [key: string]: Observable<unknown> } = {};
  selectedFile = '';
  private readonly _downloadUrls = {};
  readonly placeHolder = 'https://dummyimage.com/1x1/cccccc/000000.png&text=+';

  items: TanamFile[] = [];
  limit = 20;
  isLoading: boolean;
  isLastItem: boolean;


  constructor(
    public dialogRef: MatDialogRef<FilePickerDialogComponent>,
    private readonly fileService: UserFileService,
    private snackBar: MatSnackBar,
  ) { }

  async fetchMore(event: IPageInfo) {
    if (event.endIndex !== this.items.length - 1 || this.isLastItem) {
      return;
    }
    this.isLoading = true;
    const lastItem = this.items.length > 0 ? this.items[this.items.length - 1].id : null;
    let lastVisible = null;
    if (lastItem) {
      lastVisible = await this.fileService.getReference(lastItem);
    }
    this.fetchItems(lastVisible);
  }

  fetchItems(lastVisible: firebase.firestore.DocumentSnapshot) {
    this.fileService.getFiles('image', {
      startAfter: lastVisible,
      limit: this.limit,
      orderBy: {
        field: 'updated',
        sortOrder: 'desc'
      }
    }).pipe(
      tap(items => {
        if (!items.length || items.length < this.limit) {
          this.isLastItem = true;
        }
      }),
      map(items => {
        const mergedItems = [...this.items, ...items];
        return mergedItems.reduce((acc, cur) => ({ ...acc, [cur.id]: cur }), {});
      }),
      map(v => Object.values(v).sort(this.sortFiles))
    ).subscribe((items: TanamFile[]) => {
      this.items = [...items];
      this.isLoading = false;
    });
  }

  sortFiles(a: TanamFile, b: TanamFile) {
    const fileA = a.updated.toDate();
    const fileB = b.updated.toDate();
    return fileB - fileA;
  }

  uploadSingleFile(event) {
    const file: File = event.target.files[0];
    const uploadTaskProgress = this.fileService.upload(file);
    this.uploadTasks[file.name] = uploadTaskProgress.pipe(tap(progress => {
      if (progress === 100) {
        delete this.uploadTasks[file.name];
        this.snackBar.open('Getting file..', 'Dismiss', {
          duration: 5000,
        });
      }
    }));
  }

  selectFile(file: any) {
    this.selectedFile = file;
  }

  chooseFile() {
    this.dialogRef.close(this.selectedFile);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  getDownloadUrl(file: TanamFile): Observable<string> {
    if (!this._downloadUrls[file.id]) {
      this._downloadUrls[file.id] = this.fileService.getDownloadUrl(file, 'small')
        .pipe(tap(url => console.log(`[FilePickerDialogComponent:getDownloadUrl] ${JSON.stringify({ url })}`)));
    }

    return this._downloadUrls[file.id];
  }
}
