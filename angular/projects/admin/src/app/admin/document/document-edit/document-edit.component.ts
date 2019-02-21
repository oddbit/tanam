import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { DocumentTypeService } from '../../../services/document-type.service';
import { DocumentService } from '../../../services/document.service';
@Component({
  selector: 'tanam-document-edit',
  templateUrl: './document-edit.component.html',
  styleUrls: ['./document-edit.component.scss']
})
export class DocumentEditComponent {
  document$ = this.route.paramMap.pipe(switchMap(params => this.documentService.get(params.get('documentId'))));
  documentType$ = this.document$.pipe(switchMap(document => this.documentTypeService.getDocumentType(document.documentType)));

  constructor(
    private readonly route: ActivatedRoute,
    private readonly documentService: DocumentService,
    private readonly documentTypeService: DocumentTypeService,
  ) { }
}
