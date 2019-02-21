import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { Router } from '@angular/router';
import { DocumentTypeService } from '../../../services/document-type.service';
import { DocumentTypeListDataSource } from './document-type-list-datasource';

@Component({
  selector: 'tanam-document-type-list',
  templateUrl: './document-type-list.component.html',
  styleUrls: ['./document-type-list.component.scss']
})
export class DocumentTypeListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: DocumentTypeListDataSource;

  constructor(
    private readonly router: Router,
    private readonly documentTypeService: DocumentTypeService,
  ) { }

  displayedColumns = ['title', 'updated'];

  ngOnInit() {
    this.dataSource = new DocumentTypeListDataSource(this.documentTypeService, this.paginator, this.sort);
  }

  editDocumentType(documentTypeId: string) {
    const url = `/_/admin/type/${documentTypeId}/edit`;
    this.router.navigateByUrl(url);
  }
}
