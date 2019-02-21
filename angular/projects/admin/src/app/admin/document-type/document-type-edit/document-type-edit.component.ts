import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { DocumentTypeService } from '../../../services/document-type.service';

@Component({
  selector: 'app-document-type-edit',
  templateUrl: './document-type-edit.component.html',
  styleUrls: ['./document-type-edit.component.scss']
})
export class DocumentTypeEditComponent {
  documentType$ = this.route.paramMap.pipe(switchMap(params => this.cts.getDocumentType(params.get('typeId'))));

  constructor(
    private readonly route: ActivatedRoute,
    private readonly cts: DocumentTypeService,
  ) { }
}
