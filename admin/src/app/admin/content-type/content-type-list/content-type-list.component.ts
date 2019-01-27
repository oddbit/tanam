import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { ContentTypeListDataSource } from './content-type-list-datasource';
import { Router } from '@angular/router';
import { ContentTypeService } from '../../../services/content-type.service';

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
    private readonly contentTypeService: ContentTypeService,
  ) { }

  displayedColumns = ['title', 'updatedAt'];

  ngOnInit() {
    this.dataSource = new ContentTypeListDataSource(this.contentTypeService, this.paginator, this.sort);
  }

  editContentType(contentTypeId: string) {
    const url = `/_/admin/types/${contentTypeId}/edit`;
    this.router.navigateByUrl(url);
  }
}
