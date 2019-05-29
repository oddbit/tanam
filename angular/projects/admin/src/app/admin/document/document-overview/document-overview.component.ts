import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, tap, filter } from 'rxjs/operators';
import { DocumentType } from 'tanam-models';
import { DocumentService } from '../../../services/document.service';
import { DocumentTypeService } from '../../../services/document-type.service';
import { SiteService } from '../../../services/site.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'tanam-document-overview',
  templateUrl: './document-overview.component.html',
  styleUrls: ['./document-overview.component.scss']
})
export class DocumentOverviewComponent {
  readonly domain$ = this.siteSettingsService.getPrimaryDomain();
  readonly documentType$: Observable<DocumentType> = this.route.paramMap
    .pipe(
      switchMap(params => this.cts.getDocumentType(params.get('typeId'))),
      filter(documentType => !!documentType),
      tap(documentType => {
        this.documentCountPublished = documentType.documentCount.published || 0;
        this.documentCountUnpublished = documentType.documentCount.unpublished || 0;
        this.documentCountScheduled = documentType.documentCount.scheduled || 0;
      })
    );

  documentCountPublished = 0;
  documentCountUnpublished = 0;
  documentCountScheduled = 0;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly cts: DocumentTypeService,
    private readonly ces: DocumentService,
    private readonly siteSettingsService: SiteService,
  ) { }

  get documentCountTotal() {
    return this.documentCountPublished + this.documentCountUnpublished + this.documentCountScheduled;
  }

  async createNewEntry(documentType: DocumentType) {
    const documentId = this.ces.getNewId();
    this.ces.create(documentType, documentId);
    this.router.navigateByUrl(`/_/admin/document/${documentId}/edit`);
  }
}
