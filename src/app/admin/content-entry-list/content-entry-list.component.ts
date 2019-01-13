import { Component, OnInit, Input } from '@angular/core';
import { ContentEntryService, ContentEntry } from '../../services/content-entry.service';
import { Observable } from 'rxjs';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-content-entry-list',
  templateUrl: './content-entry-list.component.html',
  styleUrls: ['./content-entry-list.component.scss']
})
export class ContentEntryListComponent implements OnInit {
  @Input() limit = 20;
  @Input() contentTypeId: string;

  entries$: Observable<ContentEntry[]>;
  dataSource = new MatTableDataSource<ContentEntry>();
  displayedColumns: string[] = ['id', 'created', 'status', 'title'];

  constructor(private readonly ctes: ContentEntryService) { }

  ngOnInit() {
    this.entries$ = this.ctes.getContentTypeEntries(this.contentTypeId, {
      limit: this.limit,
      orderBy: {
        field: 'updateTime',
        sortOrder: 'desc',
      },
    });

    this.entries$.subscribe(entries => {
      this.dataSource.data = entries;
    });
  }
}
