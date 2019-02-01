import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs';
import { TanamDocumentContext } from '../models/dynamic-page.models';
import { DocumentContextService } from '../services/document-context.service';

@Directive({
  selector: '[tanamDocuments]'
})
export class DocumentsDirective implements OnInit {
  @Input() context: TanamDocumentContext; // TODO: Implement dependency graph (issues/36)
  @Input() type: string;
  @Input() limit: number;
  @Input() orderBy: string;
  @Input() sortOrder: 'asc' | 'desc';

  private document$: Observable<any>;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private documentService: DocumentContextService,
  ) { }

  ngOnInit() {
    if (!this.context) {
      throw Error('Document context is mandatory');
    }
    console.log(`[DocumentsDirective:ngOnInit] type=${this.type}`);
    console.log(`[DocumentsDirective:ngOnInit] context=${JSON.stringify(this.context, null, 2)}`);

    this.document$ = this.documentService.query(this.type, {
      limit: this.limit || 10,
      orderBy: {
        field: this.orderBy || 'published',
        sortOrder: this.sortOrder || 'desc',
      },
    });

    this.viewContainer.createEmbeddedView(this.templateRef, { $implicit: this.document$ });
  }
}
