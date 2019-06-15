import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription, BehaviorSubject } from 'rxjs';
import { Theme } from 'tanam-models';
import { ThemeTemplateService } from '../../../services/theme-template.service';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { map, tap, scan, mergeMap, throttleTime, take } from 'rxjs/operators';

@Component({
  selector: 'tanam-theme-template-list',
  templateUrl: './theme-template-list.component.html',
  styleUrls: ['./theme-template-list.component.scss']
})
export class ThemeTemplateListComponent implements OnInit, OnDestroy {
  @Input() theme$: Observable<Theme>;

  @ViewChild(CdkVirtualScrollViewport)
  viewport: CdkVirtualScrollViewport;
  batch = 20;
  isLastDocument = false;
  offset: BehaviorSubject<any>;
  isLoading = false;
  bottomViewportOffset = 500;
  templates: Observable<any[]>;
  lastVisible: firebase.firestore.DocumentSnapshot;
  theme: Theme;

  private _subscriptions: Subscription[] = [];

  constructor(
    private readonly router: Router,
    private readonly themeTemplateService: ThemeTemplateService,
  ) { }

  ngOnInit() {
    this._subscriptions.push(this.theme$.subscribe(theme => {
      this.theme = theme;
      this.isLastDocument = false;
      this.isLoading = false;
      this.offset = new BehaviorSubject(null);

      const batchMap = this.offset.pipe(
        throttleTime(500),
        mergeMap(n => this.getBatch(n)),
        scan((acc, batch) => ({ ...acc, ...batch })),
      );
      this.templates = batchMap.pipe(map(v => Object.values(v)));
    }));
  }

  ngOnDestroy() {
    this._subscriptions.filter(s => !!s && !s.closed).forEach(s => s.unsubscribe());
  }

  async editTemplate(templateId: string) {
    const theme = await this.theme$.pipe(take(1)).toPromise();
    const url = `/_/admin/theme/${theme.id}/templates/${templateId}`;
    this.router.navigateByUrl(url);
  }

  getBatch(lastVisible: firebase.firestore.DocumentSnapshot) {
    return this.themeTemplateService.getTemplatesForTheme(this.theme.id, {
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
      this.lastVisible = await this.themeTemplateService.getReference(this.theme.id, id);
      this.offset.next(this.lastVisible);
      this.isLoading = false;
    }
  }

  trackByIdx(i: number) {
    return i;
  }
}
