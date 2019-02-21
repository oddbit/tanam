import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Document } from 'tanam-models';
import { ContentEntryService } from '../../../services/content-entry.service';
@Component({
  selector: 'app-content-entry-edit',
  templateUrl: './content-entry-edit.component.html',
  styleUrls: ['./content-entry-edit.component.scss']
})
export class ContentEntryEditComponent implements OnInit {
  contentEntry$: Observable<Document>;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly contentEntryService: ContentEntryService,
  ) { }

  ngOnInit() {
    this.contentEntry$ = this.route.paramMap.pipe(switchMap(params => {
      const documentTypeId = params.get('documentId');
      return this.contentEntryService.get(documentTypeId);
    }));
  }
}
