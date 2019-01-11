import { Component, OnInit, Input } from '@angular/core';
import { ContentTypeEntryService, ContentTypeEntry } from '../content-type-entry.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-content-type-entry-list',
  templateUrl: './content-type-entry-list.component.html',
  styleUrls: ['./content-type-entry-list.component.scss']
})
export class ContentTypeEntryListComponent implements OnInit {
  @Input() limit = 20;
  @Input() contentTypeId: string;

  entries$: Observable<ContentTypeEntry[]>;

  constructor(private readonly ctes: ContentTypeEntryService) {
  }

  ngOnInit() {
    this.entries$ = this.ctes.getContentTypeFields(this.contentTypeId, {
      limit: this.limit,
      orderBy: {
        field: 'updateTime',
        sortOrder: 'desc',
      },
    });
  }
}
