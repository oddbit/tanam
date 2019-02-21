import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { DocumentType } from 'tanam-models';
import { ContentEntryService } from '../../../services/content-entry.service';
import { ContentEntryListDataSource } from './content-entry-list-datasource';

@Component({
  selector: 'app-content-entry-list',
  templateUrl: './content-entry-list.component.html',
  styleUrls: ['./content-entry-list.component.scss']
})
export class ContentEntryListComponent implements OnInit, OnDestroy {
  @Input() documentType$: Observable<DocumentType>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: ContentEntryListDataSource;
  private _subscriptions: Subscription[] = [];

  constructor(
    private readonly router: Router,
    private readonly contentEntryService: ContentEntryService,
  ) { }

  displayedColumns = ['title', 'updated'];

  ngOnInit() {
    this._subscriptions.push(this.documentType$.subscribe(documentType => {
      this.dataSource = new ContentEntryListDataSource(documentType, this.contentEntryService, this.paginator, this.sort);
    }));
  }

  ngOnDestroy() {
    this._subscriptions.filter(s => !!s && !s.closed).forEach(s => s.unsubscribe());
  }

  editEntry(documentId: string) {
    const url = `/_/admin/document/${documentId}`;
    this.router.navigateByUrl(url);
  }
}
