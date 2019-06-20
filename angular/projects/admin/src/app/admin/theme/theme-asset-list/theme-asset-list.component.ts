import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { UserThemeAssetService } from '../../../services/user-theme-asset.service';
import { TanamFile } from '../../../../../../../../functions/src/models';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../services/dialog.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { map, tap, scan, mergeMap, throttleTime } from 'rxjs/operators';

@Component({
  selector: 'tanam-theme-asset-list',
  templateUrl: './theme-asset-list.component.html',
  styleUrls: ['./theme-asset-list.component.scss']
})
export class ThemeAssetListComponent implements OnInit {
  readonly themeId = this.route.snapshot.paramMap.get('themeId');
  uploadTasks: { [key: string]: Observable<number> } = {};

  @ViewChild(CdkVirtualScrollViewport)
  viewport: CdkVirtualScrollViewport;
  batch = 20;
  isLastDocument = false;
  offset: BehaviorSubject<any>;
  isLoading = false;
  bottomViewportOffset = 500;
  assets: Observable<any[]>;
  lastVisible: firebase.firestore.DocumentSnapshot;
  deletedAssetId: string = null;

  constructor(
    private readonly themeAssetService: UserThemeAssetService,
    private readonly route: ActivatedRoute,
    private dialogService: DialogService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.offset = new BehaviorSubject(null);

    const batchMap = this.offset.pipe(
      throttleTime(500),
      mergeMap(n => this.getBatch(n)),
      scan((acc, batch) => {
        const assets = { ...acc, ...batch };
        if (this.deletedAssetId) {
          delete assets[this.deletedAssetId];
          this.deletedAssetId = null;
        }
        return assets;
      }),
    );
    this.assets = batchMap.pipe(map(v => Object.values(v).sort(this.sortAssets)));
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
        this.snackBar.open('Deleted', 'Dismiss', { duration: 2000 });
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

  getBatch(lastVisible: firebase.firestore.DocumentSnapshot) {
    return this.themeAssetService.getThemeAssets(this.themeId, {
      startAfter: lastVisible,
      limit: this.batch,
      orderBy: {
        field: 'title',
        sortOrder: 'asc'
      }
    }).pipe(
      tap(arr => arr.length < this.batch
        ? (this.isLastDocument = true)
        : (this.isLastDocument = false)
      ),
      map(arr => arr.reduce(
        (previousValue, currentValue) => ({ ...previousValue, [currentValue.id]: currentValue }),
        {}
      )),
    );
  }

  async nextBatch(id: string) {
    if (this.isLastDocument) {
      return;
    }
    const scrollOffset = this.viewport.measureScrollOffset('bottom');
    if (scrollOffset <= this.bottomViewportOffset && !this.isLoading) {
      this.isLoading = true;
      this.lastVisible = await this.themeAssetService.getReference(this.themeId, id);
      this.offset.next(this.lastVisible);
      this.isLoading = false;
    }
  }

  trackByIdx(i: number) {
    return i;
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
