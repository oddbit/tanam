import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
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
export class ContentEntryOverviewComponent implements OnInit {
  readonly domain$ = this.siteSettingsService.getPrimaryDomain();
  documentType$: Observable<DocumentType>;

  loading: boolean;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly cts: ContentTypeService,
    private readonly ces: ContentEntryService,
    private readonly siteSettingsService: SiteService,
  ) { }

  ngOnInit() {
    this.documentType$ = this.route.paramMap.pipe(switchMap(params => {
      const documentTypeId = params.get('typeId');
      return this.cts.getContentType(documentTypeId);
    }));
    this.loading = false;
  }

  async createNewEntry(documentType: DocumentType) {
    const entryId = this.ces.getNewId();
    this.loading = true;
    await this.ces.create(documentType, entryId);
    this.router.navigateByUrl(`/_/admin/entries/${entryId}/edit`);
    this.loading = false;
  }
}
