import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ContentType } from 'tanam-models';
import { ContentEntryService } from '../../../services/content-entry.service';
import { ContentEntryListDataSource } from './content-entry-list-datasource';

@Component({
  selector: 'app-content-entry-list',
  templateUrl: './content-entry-list.component.html',
  styleUrls: ['./content-entry-list.component.scss']
})
export class ContentEntryListComponent implements OnInit, OnDestroy {
  @Input() contentType$: Observable<ContentType>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: ContentEntryListDataSource;
  private _contentTypeSubscription: Subscription;

  constructor(
    private readonly router: Router,
    private readonly contentEntryService: ContentEntryService,
  ) { }

  displayedColumns = ['title', 'updated'];

  ngOnInit() {
    this._contentTypeSubscription = this.contentType$.subscribe(contentType => {
      this.dataSource = new ContentEntryListDataSource(contentType, this.contentEntryService, this.paginator, this.sort);
    });
  }

  ngOnDestroy() {
    if (this._contentTypeSubscription && !this._contentTypeSubscription.closed) {
      this._contentTypeSubscription.unsubscribe();
    }
  }

  editEntry(entryId: string) {
    const url = `/_/admin/entries/${entryId}`;
    this.router.navigateByUrl(url);
  }
}
