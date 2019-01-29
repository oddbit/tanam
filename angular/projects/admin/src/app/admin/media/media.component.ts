import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ContentFileService } from 'tanam-core';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss']
})
export class MediaComponent implements OnInit {
  readonly uploadTasks: { [key: string]: Observable<number> } = {};

  constructor(
    private readonly fileService: ContentFileService,
  ) { }

  ngOnInit() {
  }

  uploadSingleFile(event) {
    const file: File = event.target.files[0];
    const uploadTaskProgress = this.fileService.upload(file);
    this.uploadTasks[file.name] = uploadTaskProgress.pipe(tap(progress => {
      if (progress === 100) {
        delete this.uploadTasks[file.name];
      }
    }));
  }
}
