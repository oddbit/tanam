import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-content-entry-edit',
  templateUrl: './content-entry-edit.component.html',
  styleUrls: ['./content-entry-edit.component.scss']
})
export class ContentEntryEditComponent implements OnInit {
  readonly contentTypeId = this.route.snapshot.paramMap.get('typeId');
  readonly entryId = this.route.snapshot.paramMap.get('entryId');
  readonly onCancelRoute = `/admin/content/type/${this.contentTypeId}/entries`;
  readonly afterSaveRoute = null;

  constructor(
    private readonly route: ActivatedRoute,
  ) { }

  ngOnInit() {
  }
}
