import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TanamFile } from 'tanam-models';
import { UserFileService } from '../../../services/user-file.service';

@Component({
  selector: 'tanam-media-grid',
  templateUrl: './media-grid.component.html',
  styleUrls: ['./media-grid.component.scss']
})
export class MediaGridComponent {
  readonly files$: Observable<TanamFile[]> = this.fileService.getFiles('image');
  readonly numCols$ = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => matches ? 2 : 4));

  constructor(
    private readonly breakpointObserver: BreakpointObserver,
    private readonly fileService: UserFileService,
  ) { }
}
