import { DataSource } from '@angular/cdk/collections';
import { MatPaginator, MatSort } from '@angular/material';
import { Observable } from 'rxjs';
import { Document, DocumentType } from 'tanam-models';
import { DocumentService } from '../../../services/document.service';

export class DocumentListDataSource extends DataSource<Document> {
  data: Document[];

  constructor(
    private readonly documentType: DocumentType,
    private readonly documentService: DocumentService,
    private readonly paginator: MatPaginator,
    private readonly sort: MatSort,
    private readonly status: string,
    private readonly nextPage: Boolean,
    private readonly lastDocSnap: any,
    private readonly firstDocSnap: any
  ) {
    super();
  }

  connect(): Observable<Document[]> {
    return this.loadDocuments(
      this.paginator.pageSize,
      this.paginator.pageIndex,
      this.sort.active,
      this.sort.direction === 'asc' ? 'asc' : 'desc',
      this.nextPage,
      this.lastDocSnap,
      this.firstDocSnap
    );
  }

  disconnect() { }

  private loadDocuments(pageSize: number,
    pageIndex: number,
    field: string,
    sortOrder: 'asc' | 'desc',
    nextPage: Boolean,
    lastDocSnap?: any,
    firstDocSnap?: any
    ) {
    const queryObsv = this.documentService.query(this.documentType.id, this.status, {
      limit: pageSize,
      orderBy: {
        field: field,
        sortOrder: sortOrder
      }
    }, nextPage, pageIndex, lastDocSnap, firstDocSnap);
    return queryObsv;
  }
}
