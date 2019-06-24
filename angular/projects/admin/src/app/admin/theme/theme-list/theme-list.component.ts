import { Component, ViewChild } from '@angular/core';
import { map, tap} from 'rxjs/operators';
import { ThemeService } from '../../../services/theme.service';
import { Router } from '@angular/router';
import { IPageInfo } from 'ngx-virtual-scroller';
import { Theme } from '../../../../../../../../functions/src/models';

@Component({
  selector: 'tanam-theme-list',
  templateUrl: './theme-list.component.html',
  styleUrls: ['./theme-list.component.scss']
})
export class ThemeListComponent {

  items: Theme[] = [];
  limit = 20;
  isLoading: boolean;
  isLastItem: boolean;

  constructor(
    private readonly router: Router,
    private readonly themeService: ThemeService,
  ) {}

  async fetchMore(event: IPageInfo) {
    if (event.endIndex !== this.items.length - 1 || this.isLastItem) {
      return;
    }
    this.isLoading = true;
    const lastItem = this.items.length > 0 ? this.items[this.items.length - 1].id : null;
    let lastVisible = null;
    if (lastItem) {
      lastVisible = await this.themeService.getReference(lastItem);
    }
    this.fetchItems(lastVisible);
  }

  fetchItems(lastVisible: firebase.firestore.DocumentSnapshot) {
    this.themeService.getThemes({
      startAfter: lastVisible,
      limit: this.limit,
      orderBy: {
        field: 'updated',
        sortOrder: 'desc'
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
      map(v => Object.values(v).sort(this.sortEntry))
    ).subscribe((items: Theme[]) => {
      this.items = [...items];
      this.isLoading = false;
    });
  }

  sortEntry(a: Theme, b: Theme) {
    const dateA = a.updated.toDate().getTime();
    const dateB = b.updated.toDate().getTime();
    return dateA - dateB;
  }

  editTheme(themeId: string) {
    const url = `/_/admin/theme/${themeId}`;
    this.router.navigateByUrl(url);
  }
}
