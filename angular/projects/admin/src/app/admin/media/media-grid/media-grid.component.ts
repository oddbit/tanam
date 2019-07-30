import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { TanamFile } from 'tanam-models';
import { UserFileService } from '../../../services/user-file.service';
import { DialogService } from '../../../services/dialog.service';
import { IPageInfo } from 'ngx-virtual-scroller';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'tanam-media-grid',
  templateUrl: './media-grid.component.html',
  styleUrls: ['./media-grid.component.scss']
})
export class MediaGridComponent {
  readonly placeHolder = 'https://dummyimage.com/1x1/cccccc/000000.png&text=+';

  items: TanamFile[] = [];
  limit = 20;
  isLoading: boolean;
  isLastItem: boolean;

  private readonly _downloadUrls = {};

  constructor(
    private readonly fileService: UserFileService,
    private dialogService: DialogService,
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

  getDownloadUrl(file: TanamFile): Observable<string> {
    if (!this._downloadUrls[file.id]) {
      this._downloadUrls[file.id] = this.fileService.getDownloadUrl(file, 'small');
    }
    return this._downloadUrls[file.id];
  }

  showDetails(file: TanamFile) {
    this.dialogService.openDialogDetailFile({
      title: 'Detail Media',
      name: file.title,
      fileType: file.fileType,
      created: file.created,
      buttons: ['ok'],
      icon: 'info'
    });
  }

  remove(file: TanamFile) {
    this.dialogService.openDialogConfirm({
      title: 'Delete File',
      message: `Are you sure to delete the "${file.title}" ?`,
      buttons: ['cancel', 'yes'],
      icon: 'warning'
    }).afterClosed().subscribe(async res => {
      if (res === 'yes') {
        this.snackBar.open('Deleting file...', 'Dismiss', {
          duration: 2000
        });
        await this.fileService.remove(file);
        this.items = this.items.filter(item => item.id !== file.id);
        this.snackBar.open('File Deleted', 'Dismiss', {
          duration: 2000
        });
      }
    });
  }

  sortFiles(a: TanamFile, b: TanamFile) {
    const fileA = a.updated.toDate();
    const fileB = b.updated.toDate();
    return fileB - fileA;
  }
}
