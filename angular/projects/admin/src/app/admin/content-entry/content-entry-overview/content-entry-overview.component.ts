import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { DocumentType } from 'tanam-models';
import { ContentEntryService } from '../../../services/content-entry.service';
import { ContentTypeService } from '../../../services/content-type.service';
import { SiteService } from '../../../services/site.service';

@Component({
  selector: 'app-content-entry-overview',
  templateUrl: './content-entry-overview.component.html',
  styleUrls: ['./content-entry-overview.component.scss']
})
export class ContentEntryOverviewComponent {
  readonly domain$ = this.siteSettingsService.getPrimaryDomain();
  readonly documentType$ = this.route.paramMap.pipe(switchMap(params => this.cts.getContentType(params.get('typeId'))));

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly cts: ContentTypeService,
    private readonly ces: ContentEntryService,
    private readonly siteSettingsService: SiteService,
  ) { }

  async createNewEntry(documentType: DocumentType) {
    const documentId = this.ces.getNewId();
    this.ces.create(documentType, documentId);
    this.router.navigateByUrl(`/_/admin/document/${documentId}/edit`);
  }
}
