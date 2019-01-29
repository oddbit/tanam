import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ContentEntry, ContentEntryService } from 'tanam-core';
@Component({
  selector: 'app-content-entry-edit',
  templateUrl: './content-entry-edit.component.html',
  styleUrls: ['./content-entry-edit.component.scss']
})
export class ContentEntryEditComponent implements OnInit {
  contentEntry$: Observable<ContentEntry>;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly contentEntryService: ContentEntryService,
  ) { }

  ngOnInit() {
    this.contentEntry$ = this.route.paramMap.pipe(switchMap(params => {
      const contentTypeId = params.get('entryId');
      return this.contentEntryService.get(contentTypeId);
    }));
  }
}
