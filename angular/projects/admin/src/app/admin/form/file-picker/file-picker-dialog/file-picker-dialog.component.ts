import { Component } from '@angular/core';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs';
import { TanamFile } from 'tanam-models';
import { UserFileService } from '../../../../services/user-file.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'tanam-file-picker-dialog',
  templateUrl: './file-picker-dialog.component.html',
  styleUrls: ['./file-picker-dialog.component.scss']
})
export class FilePickerDialogComponent {
  uploadTasks: { [key: string]: Observable<number> } = {};
  selectedFile = '';
  readonly files$: Observable<TanamFile[]> = this.fileService.getFiles('image');
  private readonly _downloadUrls = {};

  constructor(
    public dialogRef: MatDialogRef<FilePickerDialogComponent>,
    private readonly fileService: UserFileService,
    private snackBar: MatSnackBar,
  ) { }

  uploadSingleFile(event) {
    const file: File = event.target.files[0];
    const uploadTaskProgress = this.fileService.upload(file);
    this.uploadTasks[file.name] = uploadTaskProgress.pipe(tap(progress => {
      if (progress === 100) {
        delete this.uploadTasks[file.name];
        this.snackBar.open('Getting file..', 'Dismiss', {
          duration: 5000,
        });
      }
    }));
  }

  selectFile(file: any) {
    this.selectedFile = file;
  }

  chooseFile() {
    this.dialogRef.close(this.selectedFile);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  getDownloadUrl(file: TanamFile): Observable<string> {
    if (!this._downloadUrls[file.id]) {
      this._downloadUrls[file.id] = this.fileService.getDownloadUrl(file, 'small')
        .pipe(tap(url => console.log(`[FilePickerDialogComponent:getDownloadUrl] ${JSON.stringify({ url })}`)));
    }

    return this._downloadUrls[file.id];
  }
}
