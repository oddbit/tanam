import { Component } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { BehaviorSubject } from 'rxjs';
import { FileService } from '../../../services/file.service';

@Component({
  selector: 'app-media-grid',
  templateUrl: './media-grid.component.html',
  styleUrls: ['./media-grid.component.scss']
})
export class MediaGridComponent {
  readonly numCols$ = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => matches ? 2 : 4));
  readonly files$ = this.fileService.getFiles('image');

  constructor(
    private readonly breakpointObserver: BreakpointObserver,
    private readonly fileService: FileService,
  ) { }
}
