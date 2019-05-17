import { Component, Input, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { Router } from '@angular/router';
import { Observable, Subscription, merge } from 'rxjs';
import { DocumentType } from 'tanam-models';
import { DocumentService } from '../../../services/document.service';
import { DocumentListDataSource } from './document-list-datasource';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'tanam-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss']
})
export class DocumentListComponent implements OnInit, OnDestroy, AfterViewInit {
  total_count: number;
  lastPageIndex = 0;

  @Input() documentType$: Observable<DocumentType>;
  @Input() status = 'all';

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: DocumentListDataSource;
  private _subscriptions: Subscription[] = [];

  constructor(
    private readonly router: Router,
    private readonly documentService: DocumentService,
  ) { }

  displayedColumns = ['title', 'slug', 'updated'];

  ngOnInit() {
    this.documentType$.subscribe(val => {
      // Reset paginator if document type change
      this.paginator.pageIndex = 0;
    });
    this.loadDataSource();
  }

  ngAfterViewInit(): void {
    // reset the paginator after sorting
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => {
          this.loadDataSource();
        })
      ).subscribe();
  }

  ngOnDestroy() {
    this._subscriptions.filter(s => !!s && !s.closed).forEach(s => s.unsubscribe());
  }

  private loadDataSource() {
    const nextPage = this.paginator.pageIndex > this.lastPageIndex;
    this.lastPageIndex = this.paginator.pageIndex;
    this._subscriptions.push(this.documentType$.subscribe(documentType => {
      this.dataSource = new DocumentListDataSource(documentType, this.documentService, this.paginator, this.sort, this.status, nextPage);
      this.setTotalCount(this.dataSource);
    }));
  }

  editEntry(documentId: string) {
    const url = `/_/admin/document/${documentId}`;
    this.router.navigateByUrl(url);
  }

  setTotalCount(dataSource: Object) {
    const refNumEntries = dataSource['documentType'].documentCount;
    if (this.status === 'all') {
      this.total_count = refNumEntries.published + refNumEntries.unpublished;
    } else if (this.status === 'published') {
      this.total_count = refNumEntries.published;
    } else {
      this.total_count = refNumEntries.unpublished;
    }
  }
}
