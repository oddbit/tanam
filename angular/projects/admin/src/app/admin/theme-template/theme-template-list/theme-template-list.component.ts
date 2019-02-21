import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Theme } from 'tanam-models';
import { ThemeTemplateService } from '../../../services/theme-template.service';
import { ThemeTemplateListDataSource } from './theme-template-list-datasource';
import { take } from 'rxjs/operators';

@Component({
  selector: 'tanam-theme-template-list',
  templateUrl: './theme-template-list.component.html',
  styleUrls: ['./theme-template-list.component.scss']
})
export class ThemeTemplateListComponent implements OnInit, OnDestroy {
  @Input() theme$: Observable<Theme>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSource: ThemeTemplateListDataSource;
  private _subscriptions: Subscription[] = [];

  constructor(
    private readonly router: Router,
    private readonly themeTemplateService: ThemeTemplateService,
  ) { }

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['selector', 'title', 'updated'];

  ngOnInit() {
    this._subscriptions.push(this.theme$.subscribe(theme => {
      this.dataSource = new ThemeTemplateListDataSource(theme, this.paginator, this.sort, this.themeTemplateService);
    }));
  }

  ngOnDestroy() {
    this._subscriptions.filter(s => !!s && !s.closed).forEach(s => s.unsubscribe());
  }

  async editTemplate(templateId: string) {
    const theme = await this.theme$.pipe(take(1)).toPromise();
    const url = `/_/admin/themes/${theme.id}/templates/${templateId}`;
    this.router.navigateByUrl(url);
  }
}
