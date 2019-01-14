import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentTypeService, ContentType } from '../../services/content-type.service';
import { ContentEntryService } from '../../services/content-entry.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-content-type-overview',
  templateUrl: './content-type-overview.component.html',
  styleUrls: ['./content-type-overview.component.scss']
})
export class ContentTypeOverviewComponent implements OnInit {
  readonly contentTypeId = this.route.snapshot.paramMap.get('typeId');
  readonly contentType$ = this.cts.getContentType(this.contentTypeId);

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly cts: ContentTypeService,
    private readonly ces: ContentEntryService,
  ) { }

  ngOnInit() {
  }

  async createNewEntry() {
    console.log('createNewEntry');
    const contentType = await this.cts.getContentType(this.contentTypeId).pipe(take(1)).toPromise();
    const newEntryDocument = await this.ces.createContentEntry(contentType);
    this.router.navigateByUrl(`/admin/content/entry/${contentType.id}/${newEntryDocument.ref.id}/edit`);
  }
}
