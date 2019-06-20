import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentTypeService } from '../../../services/document-type.service';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { map, tap, scan, mergeMap, throttleTime } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'tanam-document-type-list',
  templateUrl: './document-type-list.component.html',
  styleUrls: ['./document-type-list.component.scss']
})
export class DocumentTypeListComponent implements OnInit {
  @ViewChild(CdkVirtualScrollViewport)
  viewport: CdkVirtualScrollViewport;
  batch = 20;
  isLastDocument = false;
  offset: BehaviorSubject<any>;
  isLoading = false;
  bottomViewportOffset = 500;
  documentTypes: Observable<any[]>;
  lastVisible: firebase.firestore.DocumentSnapshot;

  constructor(
    private readonly router: Router,
    private readonly documentTypeService: DocumentTypeService,
  ) { }

  ngOnInit() {
    this.offset = new BehaviorSubject(null);

    const batchMap = this.offset.pipe(
      throttleTime(500),
      mergeMap(n => this.getBatch(n)),
      scan((acc, batch) => ({ ...acc, ...batch })),
    );
    this.documentTypes = batchMap.pipe(map(v => Object.values(v)));
  }

  editDocumentType(documentTypeId: string) {
    const url = `/_/admin/type/${documentTypeId}/edit`;
    this.router.navigateByUrl(url);
  }

  getBatch(lastVisible: firebase.firestore.DocumentSnapshot) {
    return this.documentTypeService.getDocumentTypes({
      startAfter: lastVisible,
      limit: this.batch,
      orderBy: {
        field: 'title',
        sortOrder: 'asc'
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
      this.lastVisible = await this.documentTypeService.getReference(id);
      this.offset.next(this.lastVisible);
      this.isLoading = false;
    }
  }

  trackByIdx(i: number) {
    return i;
  }
}
