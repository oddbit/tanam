import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, switchMap, tap } from 'rxjs/operators';
import { DocumentService } from '../../../services/document.service';
import { DocumentTypeService } from '../../../services/document-type.service';
import { Observable } from 'rxjs';
import { AngularTanamDocument, AngularTanamDocumentType } from '../../../app.models';

@Component({
  selector: 'tanam-document-overview',
  templateUrl: './document-overview.component.html',
  styleUrls: ['./document-overview.component.scss']
})
export class DocumentOverviewComponent {
  readonly documentType$: Observable<AngularTanamDocumentType> = this.route.paramMap
    .pipe(
      switchMap(params =>
        this.documentTypeService.getDocumentType(params.get('typeId'))
      ),
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
    private readonly documentTypeService: DocumentTypeService,
    private readonly documentService: DocumentService,
  ) {
  }

  get documentCountTotal() {
    return this.documentCountPublished + this.documentCountUnpublished + this.documentCountScheduled;
  }

  async createNewEntry(documentType: AngularTanamDocumentType) {
    const tanamDocument = AngularTanamDocument.fromDocumentType(documentType);
    return Promise.all([
      this.documentService.save(tanamDocument),
      this.router.navigateByUrl(`/_/admin/document/${tanamDocument.id}/edit`),
    ]);
  }
}
