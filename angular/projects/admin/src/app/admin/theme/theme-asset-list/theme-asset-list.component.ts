import {Component, OnInit, ViewChild, Input} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import { UserThemeAssetService } from '../../../services/user-theme-asset.service';
import { ThemeAssetListDataSource } from './theme-asset-list-datasource';
import { Theme } from '../../../../../../../../functions/src/models';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'tanam-theme-asset-list',
  templateUrl: './theme-asset-list.component.html',
  styleUrls: ['./theme-asset-list.component.scss']
})
export class ThemeAssetListComponent implements OnInit {
  readonly themeId = this.route.snapshot.paramMap.get('themeId');

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['title', 'size', 'type', 'updated', 'action'];
  dataSource: ThemeAssetListDataSource;


  constructor(
    private readonly themeAssetService: UserThemeAssetService,
    private readonly route: ActivatedRoute
  ) { }

  ngOnInit() {
    console.log(this.themeId);
    this.dataSource = new ThemeAssetListDataSource(this.themeId, this.themeAssetService, this.paginator, this.sort);
  }

  deleteFile() {
    console.log('Delete file');
  }

  detailFile() {
    console.log('Detail File');
  }
}
