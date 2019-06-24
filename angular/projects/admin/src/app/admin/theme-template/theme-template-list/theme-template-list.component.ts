import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Theme, ThemeTemplate } from 'tanam-models';
import { ThemeTemplateService } from '../../../services/theme-template.service';
import { map, tap, take } from 'rxjs/operators';
import { IPageInfo } from 'ngx-virtual-scroller';

@Component({
  selector: 'tanam-theme-template-list',
  templateUrl: './theme-template-list.component.html',
  styleUrls: ['./theme-template-list.component.scss']
})
export class ThemeTemplateListComponent implements OnInit, OnDestroy {
  @Input() theme$: Observable<Theme>;

  items: ThemeTemplate[] = [];
  limit = 20;
  isLoading: boolean;
  isLastItem: boolean;
  theme: Theme;

  private _subscriptions: Subscription[] = [];

  constructor(
    private readonly router: Router,
    private readonly themeTemplateService: ThemeTemplateService,
  ) { }

  ngOnInit() {
    this._subscriptions.push(this.theme$.subscribe(theme => {
      this.theme = theme;
      this.fetchItems(null);
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

  async fetchMore(event: IPageInfo) {
    if (event.endIndex === -1 || event.endIndex !== this.items.length - 1 || this.isLastItem) {
      return;
    }
    this.isLoading = true;
    const lastItem = this.items.length > 0 ? this.items[this.items.length - 1].id : null;
    let lastVisible = null;
    if (lastItem) {
      lastVisible = await this.themeTemplateService.getReference(this.theme.id, lastItem);
    }
    this.fetchItems(lastVisible);
  }

  fetchItems(lastVisible: firebase.firestore.DocumentSnapshot) {
    this.isLoading = true;
    this.themeTemplateService.getTemplatesForTheme(this.theme.id, {
      startAfter: lastVisible,
      limit: this.limit,
      orderBy: {
        field: 'title',
        sortOrder: 'asc'
      }
    }).pipe(
      tap(items => {
        if (!items.length || items.length < this.limit) {
          this.isLastItem = true;
        }
      }),
      map(items => {
        const mergedItems = [...this.items, ...items];
        return mergedItems.reduce((acc, cur) => ({ ...acc, [cur.id]: cur }), {});
      }),
      map(v => Object.values(v).sort(this.sortItems))
    ).subscribe((items: ThemeTemplate[]) => {
      this.items = [...items];
      this.isLoading = false;
    });
  }

  sortItems(a: ThemeTemplate, b: ThemeTemplate) {
    const itemA = a.title.toLowerCase();
    const itemB = b.title.toLowerCase();
    if (itemA < itemB) {
      return -1;
    } else if (itemA > itemB) {
      return 1;
    } else {
      return 0;
    }
  }
}
