import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';
import { map, tap, take } from 'rxjs/operators';
import { TanamFile } from 'tanam-models';
import { UserFileService } from '../../../services/user-file.service';
import { MediaDialogDetailComponent } from '../media-dialog-detail/media-dialog-detail.component';
import { MediaDialogDeleteComponent } from '../media-dialog-delete/media-dialog-delete.component';

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
    private dialog: MatDialog
  ) { }

  getDownloadUrl(file: TanamFile): Observable<string> {
    if (!this._downloadUrls[file.id]) {
      this._downloadUrls[file.id] = this.fileService.getDownloadUrl(file, 'small')
        .pipe(tap(url => console.log(`[MediaGridComponent:getDownloadUrl] ${JSON.stringify({ url })}`)));
    }

    return this._downloadUrls[file.id];
  }

  showDetails(file: TanamFile) {
    this.dialog.open(MediaDialogDetailComponent, {
      data: file
    });
    console.log(`[MediaGridComponent:showDetails] ${JSON.stringify({ file })}`);
  }

  remove(file: TanamFile) {
    const dialogRef = this.dialog.open(MediaDialogDeleteComponent, {
      data: file,
      width: '300px'
    });
    dialogRef.afterClosed().subscribe(async status => {
      if (status === 'delete') {
        this.fileService.remove(file);
      }
    });
  }
}
