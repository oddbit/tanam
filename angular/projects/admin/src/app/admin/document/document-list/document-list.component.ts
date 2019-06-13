import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { Observable, Subscription, BehaviorSubject } from 'rxjs';
import { DocumentType, Document, DocumentStatus } from 'tanam-models';
import { DocumentService } from '../../../services/document.service';
import { TaskService } from '../../../services/task.service';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { map, tap, scan, mergeMap, throttleTime } from 'rxjs/operators';

@Component({
  selector: 'tanam-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss']
})
export class DocumentListComponent implements OnInit, OnDestroy {
  @Input() documentType$: Observable<DocumentType>;
  @Input() status: DocumentStatus;

  @ViewChild(CdkVirtualScrollViewport)
  viewport: CdkVirtualScrollViewport;
  batch = 20;
  isLastDocument = false;
  offset: BehaviorSubject<any>;
  isLoading = false;
  bottomViewportOffset = 500;
  documents: Observable<any[]>;
  lastVisible: firebase.firestore.DocumentSnapshot;
  documentType: DocumentType;

  private _subscriptions: Subscription[] = [];

  constructor(
    private readonly router: Router,
    private readonly documentService: DocumentService,
    private readonly taskService: TaskService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this._subscriptions.push(this.documentType$.subscribe((documentType) => {
      this.documentType = documentType;
      this.isLastDocument = false;
      this.isLoading = false;
      this.offset = new BehaviorSubject(null);

      const batchMap = this.offset.pipe(
        throttleTime(500),
        mergeMap(n => this.getBatch(n)),
        scan((acc, batch) => ({ ...acc, ...batch })),
      );
      this.documents = batchMap.pipe(map(v => Object.values(v).sort(this.sortEntry)));
    }));
  }

  ngOnDestroy() {
    this._subscriptions.filter(s => !!s && !s.closed).forEach(s => s.unsubscribe());
  }

  getBatch(lastVisible: firebase.firestore.DocumentSnapshot) {
    return this.documentService.query(this.documentType.id, {
      startAfter: lastVisible,
      limit: this.batch,
      status: this.status,
      orderBy: {
        field: 'updated',
        sortOrder: 'desc'
      }
    }).pipe(
      tap(arr => arr.length < this.batch
        ? (this.isLastDocument = true)
        : (this.isLastDocument = false)
      ),
      map(arr => arr.reduce(
        (previousValue, currentValue) => ({ ...previousValue, [currentValue.id]: currentValue }),
        {}
      )),
    );
  }

  async nextBatch(id: string) {
    if (this.isLastDocument) {
      return;
    }
    const scrollOffset = this.viewport.measureScrollOffset('bottom');
    if (scrollOffset <= this.bottomViewportOffset && !this.isLoading) {
      this.isLoading = true;
      this.lastVisible = await this.documentService.getReference(id);
      this.offset.next(this.lastVisible);
      this.isLoading = false;
    }
  }

  trackByIdx(i: number) {
    return i;
  }

  editEntry(documentId: string) {
    const url = `/_/admin/document/${documentId}`;
    this.router.navigateByUrl(url);
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

  sortEntry(a: Document, b: Document) {
    const dateA = a.updated.toDate().getTime();
    const dateB = b.updated.toDate().getTime();
    // order by updated, sort by ascending
    return dateB - dateA;
  }
}
