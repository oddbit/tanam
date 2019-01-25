import { Component, OnInit } from '@angular/core';
import { ContentEntry, ContentEntryService } from '../../../services/content-entry.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-content-entry-new',
  templateUrl: './content-entry-new.component.html',
  styleUrls: ['./content-entry-new.component.scss']
})
export class ContentEntryNewComponent implements OnInit {
  contentEntry: ContentEntry; // TODO: get the content entry from the activated route

  constructor(
    private readonly route: ActivatedRoute,
  ) { }

  ngOnInit() {
  }
}
