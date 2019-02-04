import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { SiteTheme } from 'tanam-models';
import { ContentTemplateService } from '../../../services/content-template.service';
import { ContentTemplateListDataSource } from './content-template-list-datasource';

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
  private _themeSubscription: Subscription;

  constructor(
    private readonly router: Router,
    private readonly contentTemplateService: ContentTemplateService,
  ) { }

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['selector', 'title', 'updated'];

  ngOnInit() {
    this._themeSubscription = this.theme$.subscribe(theme => {
      this.dataSource = new ContentTemplateListDataSource(theme, this.paginator, this.sort, this.contentTemplateService);
    });
  }

  ngOnDestroy() {
    if (this._themeSubscription && !this._themeSubscription.closed) {
      this._themeSubscription.unsubscribe();
    }
  }

  editTemplate(templateId: string) {
    const url = `/_/admin/templates/${templateId}`;
    this.router.navigateByUrl(url);
  }
}
