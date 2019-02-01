import { DataSource } from '@angular/cdk/collections';
import { MatPaginator, MatSort } from '@angular/material';
import { Observable } from 'rxjs';
import { ContentType, ContentTypeService } from 'tanam-core';

export class ContentTypeListDataSource extends DataSource<ContentType> {
  data: ContentType[];

  constructor(
    private readonly contentTypeService: ContentTypeService,
    private readonly paginator: MatPaginator,
    private readonly sort: MatSort,
  ) {
    super();
  }

  connect(): Observable<ContentType[]> {
    return this.contentTypeService.getContentTypes();
  }

  disconnect() { }

  private getPagedData(data: ContentType[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  private getSortedData(data: ContentType[]) {
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
