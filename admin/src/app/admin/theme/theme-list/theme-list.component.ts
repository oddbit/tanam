import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { ThemeListDataSource } from './theme-list-datasource';
import { Router } from '@angular/router';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-theme-list',
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

  displayedColumns = ['title', 'updatedAt'];

  ngOnInit() {
    this.dataSource = new ThemeListDataSource(this.themeService, this.paginator, this.sort);
  }

  editTheme(themeId: string) {
    const url = `/_/admin/themes/${themeId}`;
    this.router.navigateByUrl(url);
  }
}
