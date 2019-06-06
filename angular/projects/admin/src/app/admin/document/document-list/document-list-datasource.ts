import { DataSource } from '@angular/cdk/collections';
import { MatPaginator, MatSort } from '@angular/material';
import { Observable } from 'rxjs';
import { Document, DocumentType, DocumentStatus } from 'tanam-models';
import { DocumentService } from '../../../services/document.service';

export class DocumentListDataSource extends DataSource<Document> {
  data: Document[];

  constructor(
    private readonly documentType: DocumentType,
    private readonly documentService: DocumentService,
    private readonly paginator: MatPaginator,
    private readonly sort: MatSort,
    private readonly status: DocumentStatus,
    private readonly docStartAt: firebase.firestore.DocumentSnapshot
  ) {
    super();
  }

  connect(): Observable<Document[]> {
    return this.loadDocuments();
  }

  disconnect() { }

  private loadDocuments() {
    const queryObsv = this.documentService.query(this.documentType.id, {
      limit: this.paginator.pageSize,
      orderBy: {
        field: this.sort.active,
        sortOrder: this.sort.direction === 'asc' ? 'asc' : 'desc',
      },
      status: this.status,
      docStartAt: this.docStartAt
    });
    return queryObsv;
  }
}
