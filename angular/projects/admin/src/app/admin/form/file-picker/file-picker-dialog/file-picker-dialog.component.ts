import { Component } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserFileService } from '../../../../services/user-file.service';
import { TanamFile } from '../../../../../../../../../models';
import { Observable } from 'rxjs';

@Component({
  selector: 'tanam-file-picker-dialog',
  templateUrl: './file-picker-dialog.component.html',
  styleUrls: ['./file-picker-dialog.component.scss']
})
export class FilePickerDialogComponent {

  readonly files$: Observable<TanamFile[]> = this.fileService.getFiles('image');

  constructor(
    public dialogRef: MatDialogRef<FilePickerDialogComponent>,
    private readonly fileService: UserFileService
  ) {}

  private selectedFile = '';

  selectFile(file: any) {
    this.selectedFile = file;
  }

  chooseFile() {
    console.log(this.selectedFile);
    this.dialogRef.close();
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
