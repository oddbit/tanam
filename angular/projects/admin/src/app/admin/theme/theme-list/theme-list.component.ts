import { Component, ViewChild } from '@angular/core';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap, scan, mergeMap, throttleTime } from 'rxjs/operators';
import { ThemeService } from '../../../services/theme.service';
import { Router } from '@angular/router';

@Component({
  selector: 'tanam-theme-list',
  templateUrl: './theme-list.component.html',
  styleUrls: ['./theme-list.component.scss']
})
export class ThemeListComponent {
  @ViewChild(CdkVirtualScrollViewport)
  viewport: CdkVirtualScrollViewport;

  theEnd = false;
  lastVisible: firebase.firestore.DocumentSnapshot;

  offset = new BehaviorSubject(null);
  themeDocs: Observable<any[]>;

  constructor(
    private readonly router: Router,
    private readonly themeService: ThemeService,
  ) {
    const batchMap = this.offset.pipe(
      throttleTime(500),
      mergeMap(n => this.getBatch(n)),
      scan((acc, batch) => {
        return { ...acc, ...batch };
      }, {})
    );
    this.themeDocs = batchMap.pipe(map(v => Object.values(v)));
  }

  getBatch(lastVisible: firebase.firestore.DocumentSnapshot) {
    return this.themeService.getThemes({
      limit: 10, startAfter: lastVisible, orderBy: {
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
    if (end === total) {
      this.lastVisible = await this.themeService.getReference(id);
      this.offset.next(this.lastVisible);
    }
  }

  trackByIdx(i: number) {
    return i;
  }

  editTheme(themeId: string) {
    const url = `/_/admin/theme/${themeId}`;
    this.router.navigateByUrl(url);
  }
}
