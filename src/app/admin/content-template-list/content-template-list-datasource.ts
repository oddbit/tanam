import { DataSource } from '@angular/cdk/collections';
import { MatPaginator, MatSort } from '@angular/material';
import { Observable } from 'rxjs';
import { ContentTemplateService, ContentTemplate } from 'src/app/services/content-template.service';

export class ContentTemplateListDataSource extends DataSource<ContentTemplate> {
  data: ContentTemplate[];

  constructor(
    private readonly paginator: MatPaginator,
    private readonly sort: MatSort,
    private readonly contentTemplateService: ContentTemplateService,
  ) {
    super();
  }

  connect(): Observable<ContentTemplate[]> {
    return this.contentTemplateService.getTemplates();
  }

  disconnect() { }

  private getPagedData(data: ContentTemplate[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  private getSortedData(data: ContentTemplate[]) {
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
