import { Component, OnInit } from '@angular/core';
import { ContentEntry, ContentEntryService } from '../../../services/content-entry.service';

@Component({
  selector: 'app-content-entry-new',
  templateUrl: './content-entry-new.component.html',
  styleUrls: ['./content-entry-new.component.scss']
})
export class ContentEntryNewComponent implements OnInit {
  contentEntry: ContentEntry;

  constructor(
    private readonly contentEntryService: ContentEntryService,
  ) { }

  ngOnInit() {
    this.contentEntry = this.contentEntryService.entryTemp;
  }
}
