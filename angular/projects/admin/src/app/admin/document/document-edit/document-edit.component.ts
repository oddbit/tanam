import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Document } from 'tanam-models';
import { DocumentService } from '../../../services/document.service';
@Component({
  selector: 'tanam-document-edit',
  templateUrl: './document-edit.component.html',
  styleUrls: ['./document-edit.component.scss']
})
export class DocumentEditComponent implements OnInit {
  document$: Observable<Document>;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly documentService: DocumentService,
  ) { }

  ngOnInit() {
    this.document$ = this.route.paramMap.pipe(switchMap(params => {
      const documentTypeId = params.get('documentId');
      return this.documentService.get(documentTypeId);
    }));
  }
}
