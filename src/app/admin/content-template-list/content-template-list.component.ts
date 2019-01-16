import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { ContentTemplateListDataSource } from './content-template-list-datasource';
import { ContentTemplateService } from 'src/app/services/content-template.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-content-template-list',
  templateUrl: './content-template-list.component.html',
  styleUrls: ['./content-template-list.component.scss']
})
export class ContentTemplateListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: ContentTemplateListDataSource;

  constructor(
    private readonly router: Router,
    private readonly contentTemplateService: ContentTemplateService,
  ) { }

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['selector', 'title', 'updatedAt'];

  ngOnInit() {
    this.dataSource = new ContentTemplateListDataSource(this.paginator, this.sort, this.contentTemplateService);
  }

  editTemplate(templateId: string) {
    this.router.navigateByUrl(`/_/admin/content/template/${templateId}/edit`);
  }
}
