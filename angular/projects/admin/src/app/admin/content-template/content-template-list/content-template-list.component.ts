import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { SiteTheme } from 'tanam-models';
import { ContentTemplateService } from '../../../services/content-template.service';
import { ContentTemplateListDataSource } from './content-template-list-datasource';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-content-template-list',
  templateUrl: './content-template-list.component.html',
  styleUrls: ['./content-template-list.component.scss']
})
export class ContentTemplateListComponent implements OnInit, OnDestroy {
  @Input() theme$: Observable<SiteTheme>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSource: ContentTemplateListDataSource;
  private _subscriptions: Subscription[] = [];

  constructor(
    private readonly router: Router,
    private readonly contentTemplateService: ContentTemplateService,
  ) { }

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['selector', 'title', 'updated'];

  ngOnInit() {
    this._subscriptions.push(this.theme$.subscribe(theme => {
      this.dataSource = new ContentTemplateListDataSource(theme, this.paginator, this.sort, this.contentTemplateService);
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
