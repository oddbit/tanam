import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { DocumentType } from 'tanam-models';
import { DocumentService } from '../../../services/document.service';
import { DocumentListDataSource } from './document-list-datasource';

@Component({
  selector: 'tanam-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss']
})
export class DocumentListComponent implements OnInit, OnDestroy {
  total_count: number;

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

  displayedColumns = ['title', 'updated'];

  ngOnInit() {
    this._subscriptions.push(this.documentType$.subscribe(documentType => {
      this.dataSource = new DocumentListDataSource(documentType, this.documentService, this.paginator, this.sort, this.status);
      this.setTotalCount(this.dataSource);
    }));
  }

  ngOnDestroy() {
    this._subscriptions.filter(s => !!s && !s.closed).forEach(s => s.unsubscribe());
  }

  editEntry(documentId: string) {
    const url = `/_/admin/document/${documentId}`;
    this.router.navigateByUrl(url);
  }
  setTotalCount (dataSource: Object) {
    const refNumEntries = dataSource['documentType'].numEntries;
    if (this.status === 'all') {
      this.total_count = refNumEntries.published + refNumEntries.unpublished;
    } else if (this.status === 'published') {
      this.total_count = refNumEntries.published;
    } else {
      this.total_count = refNumEntries.unpublished;
    }
  }
}
