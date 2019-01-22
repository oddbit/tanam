import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { ContentEntryService } from '../../../services/content-entry.service';
import { ContentTypeService } from '../../../services/content-type.service';
import { SiteSettingsService } from '../../../services/site-settings.service';

@Component({
  selector: 'app-content-entry-overview',
  templateUrl: './content-entry-overview.component.html',
  styleUrls: ['./content-entry-overview.component.scss']
})
export class ContentEntryOverviewComponent implements OnInit {
  readonly contentTypeId = this.route.snapshot.paramMap.get('typeId');
  readonly contentType$ = this.cts.getContentType(this.contentTypeId);
  readonly domain$ = this.siteSettingsService.getSiteDomain();

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly cts: ContentTypeService,
    private readonly ces: ContentEntryService,
    private readonly siteSettingsService: SiteSettingsService,
  ) { }

  ngOnInit() {
  }

  async createNewEntry() {
    const contentType = await this.cts.getContentType(this.contentTypeId).pipe(take(1)).toPromise();
    const newEntryDocument = await this.ces.createContentEntry(contentType);
    this.router.navigateByUrl(`/_/admin/content/type/${contentType.id}/entry/${newEntryDocument.ref.id}/edit`);
  }
}
