import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { Router } from '@angular/router';
import { ContentTypeService } from '../../../services/content-type.service';
import { ContentTypeListDataSource } from './content-type-list-datasource';

@Component({
  selector: 'app-content-type-list',
  templateUrl: './content-type-list.component.html',
  styleUrls: ['./content-type-list.component.scss']
})
export class ContentTypeListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: ContentTypeListDataSource;

  constructor(
    private readonly router: Router,
    private readonly documentTypeService: ContentTypeService,
  ) { }

  displayedColumns = ['title', 'updated'];

  ngOnInit() {
    this.dataSource = new ContentTypeListDataSource(this.documentTypeService, this.paginator, this.sort);
  }

  editContentType(documentTypeId: string) {
    const url = `/_/admin/type/${documentTypeId}/edit`;
    this.router.navigateByUrl(url);
  }
}
