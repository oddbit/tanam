import { DataSource } from '@angular/cdk/collections';
import { MatPaginator, MatSort } from '@angular/material';
import { Observable } from 'rxjs';
import { DocumentType } from 'tanam-models';
import { DocumentTypeService } from '../../../services/document-type.service';

export class DocumentTypeListDataSource extends DataSource<DocumentType> {
  data: DocumentType[];

  constructor(
    private readonly documentTypeService: DocumentTypeService,
    private readonly paginator: MatPaginator,
    private readonly sort: MatSort,
  ) {
    super();
  }

  connect(): Observable<DocumentType[]> {
    return this.documentTypeService.getDocumentTypes();
  }

  disconnect() { }

  private getPagedData(data: DocumentType[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  private getSortedData(data: DocumentType[]) {
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
