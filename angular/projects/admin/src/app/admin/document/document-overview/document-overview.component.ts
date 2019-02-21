import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { DocumentType } from 'tanam-models';
import { DocumentService } from '../../../services/document.service';
import { ContentTypeService } from '../../../services/content-type.service';
import { SiteService } from '../../../services/site.service';

@Component({
  selector: 'app-document-overview',
  templateUrl: './document-overview.component.html',
  styleUrls: ['./document-overview.component.scss']
})
export class DocumentOverviewComponent {
  readonly domain$ = this.siteSettingsService.getPrimaryDomain();
  readonly documentType$ = this.route.paramMap.pipe(switchMap(params => this.cts.getContentType(params.get('typeId'))));

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly cts: ContentTypeService,
    private readonly ces: DocumentService,
    private readonly siteSettingsService: SiteService,
  ) { }

  async createNewEntry(documentType: DocumentType) {
    const documentId = this.ces.getNewId();
    this.ces.create(documentType, documentId);
    this.router.navigateByUrl(`/_/admin/document/${documentId}/edit`);
  }
}
