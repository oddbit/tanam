import { Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { ContentTemplateListDataSource } from './content-template-list-datasource';
import { Router } from '@angular/router';
import { ContentTemplateService } from '../../../services/content-template.service';
import { TanamTheme } from '../../../services/theme.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-content-template-list',
  templateUrl: './content-template-list.component.html',
  styleUrls: ['./content-template-list.component.scss']
})
export class ContentTemplateListComponent implements OnInit, OnDestroy {
  @Input() theme$: Observable<TanamTheme>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSource: ContentTemplateListDataSource;
  private _themeSubscription: Subscription;

  constructor(
    private readonly router: Router,
    private readonly contentTemplateService: ContentTemplateService,
  ) { }

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['selector', 'title', 'updatedAt'];

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
    const url = `/_/admin/templates/${templateId}/edit`;
    this.router.navigateByUrl(url);
  }
}
