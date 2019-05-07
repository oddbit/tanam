import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';
import { map, tap, take } from 'rxjs/operators';
import { TanamFile } from 'tanam-models';
import { UserFileService } from '../../../services/user-file.service';
import { DialogService } from '../../../services/dialog.service';
import { MediaDialogDetailComponent } from '../media-dialog-detail/media-dialog-detail.component';

@Component({
  selector: 'tanam-media-grid',
  templateUrl: './media-grid.component.html',
  styleUrls: ['./media-grid.component.scss']
})
export class MediaGridComponent {
  readonly placeHolder = 'https://dummyimage.com/1x1/cccccc/000000.png&text=+';


  readonly files$: Observable<TanamFile[]> = this.fileService.getFiles('image')
    .pipe(tap(files => console.log(`[MediaGridComponent:files$] num files: ${files.length}`)));

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
    private dialog: MatDialog,
    private dialogService: DialogService
  ) { }

  getDownloadUrl(file: TanamFile): Observable<string> {
    if (!this._downloadUrls[file.id]) {
      this._downloadUrls[file.id] = this.fileService.getDownloadUrl(file, 'small')
        .pipe(tap(url => console.log(`[MediaGridComponent:getDownloadUrl] ${JSON.stringify({ url })}`)));
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
        this.fileService.remove(file);
      }
    });
  }
}
