import { DataSource } from '@angular/cdk/collections';
import { MatPaginator, MatSort } from '@angular/material';
import { Observable } from 'rxjs';
import { ContentEntryService, ContentEntry } from '../../../services/content-entry.service';

export class ContentEntryListDataSource extends DataSource<ContentEntry> {
  data: ContentEntry[];

  constructor(
    private readonly contentTypeId: string,
    private readonly contentEntryService: ContentEntryService,
    private readonly paginator: MatPaginator,
    private readonly sort: MatSort,
  ) {
    super();
  }

  connect(): Observable<ContentEntry[]> {
    return this.contentEntryService.getContentEntries(this.contentTypeId);
  }

  disconnect() { }

  private getPagedData(data: ContentEntry[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  private getSortedData(data: ContentEntry[]) {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'title': return compare(a.title, b.title, isAsc);
        case 'updatedAt': return compare(+a.updatedAt, +b.updatedAt, isAsc);
        default: return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a, b, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
