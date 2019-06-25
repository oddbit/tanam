import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { DocumentType, Document, DocumentStatus } from 'tanam-models';
import { DocumentService } from '../../../services/document.service';
import { TaskService } from '../../../services/task.service';
import { map, tap } from 'rxjs/operators';
import { IPageInfo } from 'ngx-virtual-scroller';

@Component({
  selector: 'tanam-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss']
})
export class DocumentListComponent implements OnInit, OnDestroy {
  @Input() documentType$: Observable<DocumentType>;
  @Input() status: DocumentStatus;

  items: Document[] = [];
  limit = 20;
  isLoading: boolean;
  isLastItem: boolean;
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
      this.items = [];
      this.isLoading = false;
      this.isLastItem = false;

      this.fetchItems(null);
    }));
  }

  ngOnDestroy() {
    this._subscriptions.filter(s => !!s && !s.closed).forEach(s => s.unsubscribe());
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

  async fetchMore(event: IPageInfo) {
    if (event.endIndex === -1 || event.endIndex !== this.items.length - 1 || this.isLastItem) {
      return;
    }
    this.isLoading = true;
    const lastItem = this.items.length > 0 ? this.items[this.items.length - 1].id : null;
    let lastVisible = null;
    if (lastItem) {
      lastVisible = await this.documentService.getReference(lastItem);
    }
    this.fetchItems(lastVisible);
  }

  fetchItems(lastVisible: firebase.firestore.DocumentSnapshot) {
    this.documentService.query(this.documentType.id, {
      startAfter: lastVisible,
      limit: this.limit,
      status: this.status,
      orderBy: {
        field: 'updated',
        sortOrder: 'desc'
      }
    }).pipe(
      tap(items => {
        if (!items.length || items.length < this.limit) {
          this.isLastItem = true;
        }
      }),
      map(items => {
        const mergedItems = [...this.items, ...items];
        return mergedItems.reduce((acc, cur) => ({ ...acc, [cur.id]: cur }), {});
      }),
      map(v => Object.values(v).sort(this.sortEntry))
    ).subscribe((items: Document[]) => {
      this.items = [...items];
      this.isLoading = false;
    });
  }

  sortEntry(a: Document, b: Document) {
    const dateA = a.updated.toDate().getTime();
    const dateB = b.updated.toDate().getTime();
    // order by updated, sort by descending
    return dateB - dateA;
  }
}
