import {Component, OnInit, ViewChild, Input} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource, MatSnackBar} from '@angular/material';
import { UserThemeAssetService } from '../../../services/user-theme-asset.service';
import { ThemeAssetListDataSource } from './theme-asset-list-datasource';
import {  TanamFile } from '../../../../../../../../functions/src/models';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../services/dialog.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'tanam-theme-asset-list',
  templateUrl: './theme-asset-list.component.html',
  styleUrls: ['./theme-asset-list.component.scss']
})
export class ThemeAssetListComponent implements OnInit {
  readonly themeId = this.route.snapshot.paramMap.get('themeId');
  uploadTasks: { [key: string]: Observable<number> } = {};

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['title', 'size', 'type', 'updated', 'action'];
  dataSource: ThemeAssetListDataSource;


  constructor(
    private readonly themeAssetService: UserThemeAssetService,
    private readonly route: ActivatedRoute,
    private dialogService: DialogService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    console.log(this.themeId);
    this.dataSource = new ThemeAssetListDataSource(this.themeId, this.themeAssetService, this.paginator, this.sort);
  }

  uploadSingleFile(event) {
    const file: File = event.target.files[0];
    console.log(file);
    const uploadTaskProgress = this.themeAssetService.uploadThemeAsset(file, this.themeId);
    this.uploadTasks[file.name] = uploadTaskProgress.pipe(tap(progress => {
      if (progress === 100) {
        delete this.uploadTasks[file.name];
        this.snackBar.open('Getting file..', 'Dismiss', {
          duration: 5000,
        });
      }
    }));
  }

  deleteFile(file: TanamFile) {
    this.dialogService.openDialogConfirm({
      title: 'Delete Content Type',
      message: `Are you sure to delete the "${file.title}" ?`,
      buttons: ['cancel', 'yes'],
      icon: 'warning'
    }).afterClosed().subscribe(async res => {
      if (res === 'yes') {
        this.snackBar.open('Deleting..', 'Dismiss', {duration: 2000});
        await this.themeAssetService.deleteThemeAsset(file, this.themeId);
        this.snackBar.open('Deleted', 'Dismiss', {duration: 2000});
      }
    });
  }

  detailFile(file: TanamFile) {
    console.log('[Detail File]' + JSON.stringify(file));
    this.dialogService.openDialogDetailFile({
      title: 'Detail File',
      name: file.title,
      fileType: file.fileType,
      created: file.created,
      buttons: ['ok'],
      icon: 'info'
    });
  }
}
