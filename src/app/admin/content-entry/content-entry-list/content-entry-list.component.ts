import { Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { ContentEntryListDataSource } from './content-entry-list-datasource';
import { Router } from '@angular/router';
import { ContentEntryService } from '../../../services/content-entry.service';
import { ContentType } from '../../../services/content-type.service';
import { Observable, Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

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

  displayedColumns = ['title', 'updatedAt'];

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
