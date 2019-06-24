import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { UserThemeAssetService } from '../../../services/user-theme-asset.service';
import { TanamFile } from '../../../../../../../../functions/src/models';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../services/dialog.service';
import { Observable } from 'rxjs';
import { IPageInfo } from 'ngx-virtual-scroller';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'tanam-theme-asset-list',
  templateUrl: './theme-asset-list.component.html',
  styleUrls: ['./theme-asset-list.component.scss']
})
export class ThemeAssetListComponent {
  readonly themeId = this.route.snapshot.paramMap.get('themeId');
  uploadTasks: { [key: string]: Observable<number> } = {};
  items: TanamFile[] = [];
  limit = 20;
  isLoading: boolean;
  isLastItem: boolean;
  deletedAssetId: string = null;

  constructor(
    private readonly themeAssetService: UserThemeAssetService,
    private readonly route: ActivatedRoute,
    private dialogService: DialogService,
    private snackBar: MatSnackBar
  ) { }

  async fetchMore(event: IPageInfo) {
    if (event.endIndex !== this.items.length - 1 || this.isLastItem) {
      return;
    }
    this.isLoading = true;
    const lastItem = this.items.length > 0 ? this.items[this.items.length - 1].id : null;
    let lastVisible = null;
    if (lastItem) {
      lastVisible = await this.themeAssetService.getReference(this.themeId, lastItem);
    }
    this.fetchItems(lastVisible);
  }

  fetchItems(lastVisible: firebase.firestore.DocumentSnapshot) {
    this.themeAssetService.getThemeAssets(this.themeId, {
      startAfter: lastVisible,
      limit: this.limit,
      orderBy: {
        field: 'title',
        sortOrder: 'asc'
      }
    }).pipe(
      tap(assets => {
        if (!assets.length || assets.length < this.limit) {
          this.isLastItem = true;
        }
      }),
      map(assets => {
        const mergedAssets = [...this.items, ...assets];
        return mergedAssets.reduce((acc, cur) => ({ ...acc, [cur.id]: cur }), {});
      }),
      map(v => Object.values(v).sort(this.sortAssets))
    ).subscribe((items: TanamFile[]) => {
      this.items = [...items];
      this.isLoading = false;
    });
  }

  uploadSingleFile(event) {
    const file: File = event.target.files[0];
    console.log(file);
    const uploadTaskProgress = this.themeAssetService.uploadThemeAsset(file, this.themeId);
    this.uploadTasks[file.name] = uploadTaskProgress.pipe(tap(progress => {
      if (progress === 100) {
        delete this.uploadTasks[file.name];
        this.snackBar.open('Getting file..', 'Dismiss', {
          duration: 5000,
        });
      }
    }));
  }

  deleteFile(file: TanamFile) {
    this.dialogService.openDialogConfirm({
      title: 'Delete Content Type',
      message: `Are you sure to delete the "${file.title}" ?`,
      buttons: ['cancel', 'yes'],
      icon: 'warning'
    }).afterClosed().subscribe(async res => {
      if (res === 'yes') {
        this.snackBar.open('Deleting..', 'Dismiss', { duration: 2000 });
        this.deletedAssetId = file.id;
        await this.themeAssetService.deleteThemeAsset(file, this.themeId);
        this.items = this.items.filter(item => item.id !== file.id);
        this.snackBar.open('File Deleted', 'Dismiss', {
          duration: 2000
        });
      }
    });
  }

  detailFile(file: TanamFile) {
    console.log('[Detail File]' + JSON.stringify(file));
    this.dialogService.openDialogDetailFile({
      title: 'Detail File',
      name: file.title,
      fileType: file.fileType,
      created: file.created,
      buttons: ['ok'],
      icon: 'info'
    });
  }

  sortAssets(a: TanamFile, b: TanamFile) {
    const titleA = a.title.toLowerCase();
    const titleB = b.title.toLowerCase();
    if (titleA > titleB) {
      return 1;
    } else if (titleA < titleB) {
      return -1;
    }
    return 0;
  }
}
