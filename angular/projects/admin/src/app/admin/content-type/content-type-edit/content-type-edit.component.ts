import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-content-type-edit',
  templateUrl: './content-type-edit.component.html',
  styleUrls: ['./content-type-edit.component.scss']
})
export class ContentTypeEditComponent implements OnInit {
  readonly contentTypeId = this.route.snapshot.paramMap.get('typeId');
  readonly entryId = this.route.snapshot.paramMap.get('entryId');
  readonly onCancelRoute = `/_/admin/types/${this.contentTypeId}`;
  readonly afterSaveRoute = null;

  constructor(
    private readonly route: ActivatedRoute,
  ) { }

  ngOnInit() {
  }
}
