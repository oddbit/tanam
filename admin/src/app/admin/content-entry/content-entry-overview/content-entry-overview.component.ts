import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ContentEntryService, ContentTypeService, SiteSettingsService } from 'tanam-core';
import { ContentType } from 'tanam-core';

@Component({
  selector: 'app-content-entry-overview',
  templateUrl: './content-entry-overview.component.html',
  styleUrls: ['./content-entry-overview.component.scss']
})
export class ContentEntryOverviewComponent implements OnInit {
  readonly domain$ = this.siteSettingsService.getSiteDomain();
  contentType$: Observable<ContentType>;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly cts: ContentTypeService,
    private readonly ces: ContentEntryService,
    private readonly siteSettingsService: SiteSettingsService,
  ) { }

  ngOnInit() {
    this.contentType$ = this.route.paramMap.pipe(switchMap(params => {
      const contentTypeId = params.get('typeId');
      return this.cts.getContentType(contentTypeId);
    }));
  }

  async createNewEntry(contentType: ContentType) {
    const entryId = this.ces.getNewId();
    this.ces.create(contentType, entryId);
    this.router.navigateByUrl(`/_/admin/entries/${entryId}/edit`);
  }
}
