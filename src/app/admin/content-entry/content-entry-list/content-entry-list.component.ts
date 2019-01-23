import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { ContentEntryListDataSource } from './content-entry-list-datasource';
import { Router } from '@angular/router';
import { ContentEntryService } from '../../../services/content-entry.service';

@Component({
  selector: 'app-content-entry-list',
  templateUrl: './content-entry-list.component.html',
  styleUrls: ['./content-entry-list.component.scss']
})
export class ContentEntryListComponent implements OnInit {
  @Input() contentTypeId: string;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: ContentEntryListDataSource;

  constructor(
    private readonly router: Router,
    private readonly contentEntryService: ContentEntryService,
  ) { }

  displayedColumns = ['title', 'updatedAt'];

  ngOnInit() {
    console.log(`[ContentEntryListComponent:ngOnInit] ${this.contentTypeId}`);
    this.dataSource = new ContentEntryListDataSource(this.contentTypeId, this.contentEntryService, this.paginator, this.sort);
  }

  editEntry(entryId: string) {
    const url = `/_/admin/entries/${entryId}`;
    this.router.navigateByUrl(url);
  }
}
