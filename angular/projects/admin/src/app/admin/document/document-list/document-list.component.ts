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

  displayedColumns = ['title', 'url', 'updated', 'actionMenu'];

  ngOnInit() {
    this.loadDataSource();
  }

  ngAfterViewInit(): void {
    // reset the paginator after sorting
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => {
          this.loadDataSource();
        }
        )
      ).subscribe();
  }

  ngOnDestroy() {
    this._subscriptions.filter(s => !!s && !s.closed).forEach(s => s.unsubscribe());
  }

  private loadDataSource() {
    this._subscriptions.push(this.documentType$.subscribe(documentType => {
      this.dataSource = new DocumentListDataSource(documentType, this.documentService, this.paginator, this.sort, this.status);
      this.setTotalCount(this.dataSource);
    }));
  }

  editEntry(documentId: string) {
    const url = `/_/admin/document/${documentId}`;
    this.router.navigateByUrl(url);
  }
  setTotalCount(dataSource: any) {
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
}
