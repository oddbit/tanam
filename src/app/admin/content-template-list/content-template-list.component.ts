import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { ContentTemplateListDataSource } from './content-template-list-datasource';

@Component({
  selector: 'app-content-template-list',
  templateUrl: './content-template-list.component.html',
  styleUrls: ['./content-template-list.component.scss']
})
export class ContentTemplateListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: ContentTemplateListDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'name'];

  ngOnInit() {
    this.dataSource = new ContentTemplateListDataSource(this.paginator, this.sort);
  }
}
