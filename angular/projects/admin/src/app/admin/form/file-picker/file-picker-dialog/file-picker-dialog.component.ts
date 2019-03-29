import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs';
import { TanamFile } from 'tanam-models';
import { UserFileService } from '../../../../services/user-file.service';

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
    this.dialogRef.close(this.selectedFile);
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
