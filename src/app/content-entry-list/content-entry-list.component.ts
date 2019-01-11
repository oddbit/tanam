import { Component, OnInit, Input } from '@angular/core';
import { ContentEntryService, ContentEntry } from '../content-entry/content-entry.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-content-entry-list',
  templateUrl: './content-entry-list.component.html',
  styleUrls: ['./content-entry-list.component.scss']
})
export class ContentEntryListComponent implements OnInit {
  @Input() limit = 20;
  @Input() contentTypeId: string;

  entries$: Observable<ContentEntry[]>;

  constructor(private readonly ctes: ContentEntryService) { }

  ngOnInit() {
    this.entries$ = this.ctes.getContentTypeEntries(this.contentTypeId, {
      limit: this.limit,
      orderBy: {
        field: 'updateTime',
        sortOrder: 'desc',
      },
    });
  }
}
