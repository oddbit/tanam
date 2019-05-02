import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import { UserThemeAssetService } from '../../../services/user-theme-asset.service';
import { ThemeAssetListDataSource } from './theme-asset-list-datasource';

@Component({
  selector: 'tanam-theme-asset-list',
  templateUrl: './theme-asset-list.component.html',
  styleUrls: ['./theme-asset-list.component.scss']
})
export class ThemeAssetListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['title', 'size', 'type', 'updated', 'action'];
  dataSource: ThemeAssetListDataSource;


  constructor(
    private readonly themeAssetService: UserThemeAssetService
  ) { }

  ngOnInit() {
    this.dataSource = new ThemeAssetListDataSource(this.themeAssetService, this.paginator, this.sort);
  }

  deleteFile() {
    console.log('Delete file');
  }

  detailFile() {
    console.log('Detail File');
  }
}
