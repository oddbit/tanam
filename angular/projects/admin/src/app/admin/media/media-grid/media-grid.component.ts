import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, ViewChild } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap, throttleTime, mergeMap, scan } from 'rxjs/operators';
import { TanamFile } from 'tanam-models';
import { UserFileService } from '../../../services/user-file.service';
import { DialogService } from '../../../services/dialog.service';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

@Component({
  selector: 'tanam-media-grid',
  templateUrl: './media-grid.component.html',
  styleUrls: ['./media-grid.component.scss']
})
export class MediaGridComponent {
  readonly placeHolder = 'https://dummyimage.com/1x1/cccccc/000000.png&text=+';
  @ViewChild(CdkVirtualScrollViewport)
  viewport: CdkVirtualScrollViewport;

  theEnd = false;
  lastVisible: firebase.firestore.DocumentSnapshot;

  offset = new BehaviorSubject(null);
  infinite: Observable<any[]>;
  action: string;

  readonly numCols$ = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map(({ matches }) => matches ? 2 : 4),
      tap(numCols => console.log(`[MediaGridComponent:numCols$] ${JSON.stringify({ numCols })}`)),
    );

  private readonly _downloadUrls = {};

  constructor(
    private readonly breakpointObserver: BreakpointObserver,
    private readonly fileService: UserFileService,
    private dialogService: DialogService
  ) {
    const batchMap = this.offset.pipe(
      throttleTime(500),
      mergeMap(n => this.getBatch(n)),
      scan((acc, value) => {
        if (this.action === 'deleted') {
          this.action = null;
          return { ...value };
        }
        return { ...acc, ...value };
      }, {}),
    );
    this.infinite = batchMap.pipe(map(v => {
      return Object.values(v);
    }));
  }

  getBatch(lastVisible: firebase.firestore.DocumentSnapshot) {
    return this.fileService.getFiles('image', {
      limit: 12,
      startAt: lastVisible,
      orderBy: {
        field: 'updated',
        sortOrder: 'desc'
      }
    })
      .pipe(
        tap(arr => (arr.length ? false : (this.theEnd = true))),
        map(arr => {
          return arr.reduce((acc, cur) => {
            const id = cur.id;
            const data = cur;
            return { ...acc, [id]: data };
          }, {});
        })
      );
  }

  async nextBatch(id: string) {
    if (this.theEnd) {
      return;
    }

    const end = this.viewport.getRenderedRange().end;
    const total = this.viewport.getDataLength();
    console.log(`${end}, '>=', ${total}`);
    if (end === total) {
      this.lastVisible = await this.fileService.getReference(id);
      this.offset.next(this.lastVisible);
    }
  }

  trackByIdx(i: number) {
    return i;
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
    }).afterClosed().subscribe(res => {
      if (res === 'yes') {
        this.fileService.remove(file);
        this.action = 'deleted';
      }
    });
  }
}
