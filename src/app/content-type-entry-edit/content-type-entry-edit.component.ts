import { Component, OnInit } from '@angular/core';
import { ContentTypeEntryService } from '../content-type-entry/content-type-entry.service';
import { ContentTypeFieldService } from '../content-type-field.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-content-type-entry-edit',
  templateUrl: './content-type-entry-edit.component.html',
  styleUrls: ['./content-type-entry-edit.component.scss']
})
export class ContentTypeEntryEditComponent implements OnInit {
  readonly contentTypeId: string;
  readonly entryId: string;
  readonly entry$: any;

  constructor(readonly route: ActivatedRoute, readonly ctes: ContentTypeEntryService, readonly ctfs: ContentTypeFieldService) {
    this.contentTypeId = route.snapshot.paramMap.get('typeId');
    this.entryId = route.snapshot.paramMap.get('entryId');
    this.entry$ = ctes.getContentTypeEntry(this.contentTypeId, this.entryId);
  }

  ngOnInit() {
  }
}
