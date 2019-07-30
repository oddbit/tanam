import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserFileService } from '../../services/user-file.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'tanam-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss']
})
export class MediaComponent implements OnInit {
  uploadTasks: { [key: string]: Observable<number | unknown> } = {};

  @ViewChild('fileInput', { static: false })
  fileInputVariable: ElementRef;

  constructor(
    private readonly fileService: UserFileService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
  }

  uploadSingleFile(event) {
    const file: File = event.target.files[0];
    const uploadTaskProgress = this.fileService.upload(file);
    this.uploadTasks[file.name] = uploadTaskProgress.pipe(tap(progress => {
      if (progress === 100) {
        delete this.uploadTasks[file.name];
        this.fileInputVariable.nativeElement.value = '';
        this.snackBar.open('Getting file..', 'Dismiss', {
          duration: 5000,
        });
      }
    }));
  }
}
