import { Component, Input, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatSort, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { Observable, Subscription, merge } from 'rxjs';
import { DocumentType, Document } from 'tanam-models';
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
  arrFirstDocId = [];
  firstDocSnap: firebase.firestore.DocumentSnapshot;
  lastDocId: string;
  lastDocSnap: firebase.firestore.DocumentSnapshot;

  @Input() documentType$: Observable<DocumentType>;
  @Input() status = 'all';

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
    this.documentType$.subscribe(val => {
      this.paginator.pageIndex = 0;
    });
    this.loadDataSource();
    this._subscriptions.push(this.documentType$.subscribe((documentType) => {
      // Reset Pagination value when documentTypa changed
      this.lastDocSnap = null;
      this.firstDocSnap = null;
      this.arrFirstDocId = [];
      this.lastDocId = '';

      this.displayedColumns = ['title'];

      if (this.status === 'all') {
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
          this.lastDocSnap = await this.documentService.getReference(this.lastDocId);
          if (!nextPage && this.paginator.pageIndex !== 0 ) {
            this.firstDocSnap = await this.documentService.getReference(this.arrFirstDocId[this.arrFirstDocId.length - 2]);
            this.arrFirstDocId.length = this.arrFirstDocId.length - 1;
          } else if (this.paginator.pageIndex === 0) {
            this.firstDocSnap = await this.documentService.getReference(this.arrFirstDocId[0]);
            this.arrFirstDocId = [];
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
        nextPage,
        this.lastDocSnap,
        this.firstDocSnap
      );
      this.dataSource.connect().subscribe(docs => {
        if (nextPage || this.paginator.pageIndex === 0) {
          this.arrFirstDocId.push(docs[0].id);
        }
        this.lastDocId = docs[docs.length - 1].id;
      });
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

  private resetPagination () {

  }
}
