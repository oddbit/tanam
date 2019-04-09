import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserFileService } from '../../services/user-file.service';

@Component({
  selector: 'tanam-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss']
})
export class MediaComponent implements OnInit {
  uploadTasks: { [key: string]: Observable<number> } = {};
  createPlaceholder = false;

  constructor(
    private readonly fileService: UserFileService,
  ) { }

  ngOnInit() {
  }

  uploadSingleFile(event) {
    const file: File = event.target.files[0];
    const uploadTaskProgress = this.fileService.upload(file);
    this.uploadTasks[file.name] = uploadTaskProgress.pipe(tap(progress => {
      this.createPlaceholder = false;
      console.log(progress);
      if (progress === 100) {
        delete this.uploadTasks[file.name];
        this.createPlaceholder = true;
      }
    }));
  }
}
