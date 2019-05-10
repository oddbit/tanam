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
  ) {
    super();
  }

  connect(): Observable<Document[]> {
    console.log(this.sort);
    return this.loadDocuments('updated', 'desc');
  }

  disconnect() { }

  private loadDocuments (field: string, sortOrder: 'asc' | 'desc') {
    return this.documentService.query(this.documentType.id, this.status, {
      orderBy: {
        field: field,
        sortOrder: sortOrder
      }
    });
  }

  private getPagedData(data: Document[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  private getSortedData(data: Document[]) {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'title': return compare(a.title, b.title, isAsc);
        case 'updated': return compare(+a.updated, +b.updated, isAsc);
        default: return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a, b, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
