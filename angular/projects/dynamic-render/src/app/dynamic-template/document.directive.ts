import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs';
import { TanamDocumentContext } from 'tanam-models';
import { DocumentContextService } from '../services/document-context.service';

@Directive({
  selector: '[tanamDocument]',
})
export class DocumentDirective implements OnInit {
  @Input() context: TanamDocumentContext; // TODO: Implement dependency graph (issues/36)
  @Input() documentId: string;
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
    this.document$ = this.documentService.getById(this.documentId);
    this.viewContainer.createEmbeddedView(this.templateRef, { $implicit: this.document$ });
  }
}
