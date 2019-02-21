import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { Router } from '@angular/router';
import { ThemeService } from '../../../services/theme.service';
import { ThemeListDataSource } from './theme-list-datasource';

@Component({
  selector: 'tanam-theme-list',
  templateUrl: './theme-list.component.html',
  styleUrls: ['./theme-list.component.scss']
})
export class ThemeListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: ThemeListDataSource;

  constructor(
    private readonly router: Router,
    private readonly themeService: ThemeService,
  ) { }

  displayedColumns = ['title', 'updated'];

  ngOnInit() {
    this.dataSource = new ThemeListDataSource(this.themeService, this.paginator, this.sort);
  }

  editTheme(themeId: string) {
    const url = `/_/admin/theme/${themeId}`;
    this.router.navigateByUrl(url);
  }
}
