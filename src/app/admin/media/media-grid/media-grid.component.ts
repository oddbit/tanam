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
  numCols$ = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => matches ? 2 : 4));

  files$ = this.fileService.getFiles('image').pipe(tap(file => console.log(JSON.stringify(file, null, 2))));

  constructor(
    private readonly breakpointObserver: BreakpointObserver,
    private readonly fileService: FileService,
  ) { }
}
