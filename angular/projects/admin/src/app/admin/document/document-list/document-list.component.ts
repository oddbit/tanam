import { Component, Input, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatSort, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { Observable, Subscription, merge } from 'rxjs';
import { DocumentType, Document, DocumentStatus } from 'tanam-models';
import { DocumentService } from '../../../services/document.service';
import { DocumentListDataSource } from './document-list-datasource';
import { tap } from 'rxjs/operators';
import { TaskService } from '../../../services/task.service';

@Component({
  selector: 'tanam-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss']
})
export class DocumentListComponent implements OnInit, OnDestroy, AfterViewInit {
  total_count: number;
  lastPageIndex = 0;
  arrLastDocsId: string[] ;
  docSnap: firebase.firestore.DocumentSnapshot;

  @Input() documentType$: Observable<DocumentType>;
  @Input() status: DocumentStatus;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: DocumentListDataSource;
  private _subscriptions: Subscription[] = [];

  constructor(
    private readonly router: Router,
    private readonly documentService: DocumentService,
    private readonly taskService: TaskService,
    private snackBar: MatSnackBar,
  ) { }

  displayedColumns: string[] = [];

  shouldDisplayColumn(title: string) {
    return this.displayedColumns.indexOf(title) >= 0;
  }

  ngOnInit() {
    this.loadDataSource();
    this._subscriptions.push(this.documentType$.subscribe((documentType) => {
      // Reset Pagination value when documentType changed
      this.paginator.pageIndex = 0;
      this.lastPageIndex = 0;
      this.docSnap = null;
      this.arrLastDocsId = [];
      this.displayedColumns = ['title'];

      if (!this.status) {
        this.displayedColumns.push('status');
      }

      if (documentType.standalone) {
        this.displayedColumns.push('url');
      }

      this.displayedColumns.push('updated', 'actionMenu');
    }));
  }

  ngAfterViewInit(): void {
    // reset the paginator after sorting
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(async () => {
          const nextPage = this.paginator.pageIndex > this.lastPageIndex;
          this.docSnap = await this.documentService.getReference(this.arrLastDocsId[this.arrLastDocsId.length - 1]);
          if (!nextPage && this.paginator.pageIndex !== 0 ) {
            this.docSnap = await this.documentService.getReference(this.arrLastDocsId[this.arrLastDocsId.length - 3]);
            this.arrLastDocsId.length = this.arrLastDocsId.length - 1;
          } else if (this.paginator.pageIndex === 0) {
            this.docSnap = null;
            this.arrLastDocsId = [];
          }
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
      this.dataSource = new DocumentListDataSource(
        documentType,
        this.documentService,
        this.paginator,
        this.sort,
        this.status,
        this.docSnap
      );
      this.dataSource.connect().subscribe(docs => {
        if ((nextPage || this.paginator.pageIndex === 0) && !this.arrLastDocsId.includes(docs[docs.length - 1].id)) {
          this.arrLastDocsId.push(docs[docs.length - 1].id);
        }
      });
      this.setTotalCount(this.dataSource);
    }));
  }

  editEntry(documentId: string) {
    const url = `/_/admin/document/${documentId}`;
    this.router.navigateByUrl(url);
  }

  setTotalCount(dataSource: DocumentListDataSource) {
    const refNumEntries = dataSource['documentType'].documentCount;
    if (!this.status) {
      this.total_count = refNumEntries.published + refNumEntries.unpublished + refNumEntries.scheduled;
    } else if (this.status === 'published') {
      this.total_count = refNumEntries.published;
    } else if (this.status === 'unpublished') {
      this.total_count = refNumEntries.unpublished;
    } else if (this.status === 'scheduled') {
      this.total_count = refNumEntries.scheduled;
    } else {
      this.total_count = 0;
    }
  }

  async rebuildEntry(document: Document) {
    this.snackBar.open('Rebuilding...', 'Dismiss', {
      duration: 5000
    });
    await this.taskService.updateCache(document.url);
    this.snackBar.open('Success', 'Dismiss', {
      duration: 2000
    });
  }
}
