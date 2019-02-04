import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DocumentTemplate } from 'tanam-models';
import { ContentTemplateService } from '../../../services/content-template.service';

@Component({
  selector: 'app-content-template-form',
  templateUrl: './content-template-form.component.html',
  styleUrls: ['./content-template-form.component.scss']
})
export class ContentTemplateFormComponent implements OnInit, OnDestroy {
  @Input() themeId: string;
  @Input() templateId: string;

  template: DocumentTemplate;
  readonly templateForm: FormGroup = this.fb.group({
    title: [null, Validators.required],
    selector: [null, Validators.required],
    templateHtml: [null, Validators.required],
    templateStyle: null,
  });
  templateSubscription: Subscription;

  constructor(
    private readonly fb: FormBuilder,
    private readonly contentTemplateservice: ContentTemplateService,
  ) { }

  ngOnInit() {
    this.templateSubscription = this.contentTemplateservice
      .getTemplate(this.themeId, this.templateId)
      .subscribe(template => {
        this.template = template;
        this.templateForm.patchValue({
          title: template.title,
          selector: template.selector,
          templateHtml: template.template,
          templateStyle: template.styles[0]
        });
      });
  }

  ngOnDestroy() {
    if (this.templateSubscription && !this.templateSubscription.closed) {
      this.templateSubscription.unsubscribe();
    }
  }

  onSave() {
    const formData = this.templateForm.value;
    this.contentTemplateservice.saveTemplate({
      id: this.templateId,
      title: formData.title,
      selector: formData.selector,
      template: formData.templateHtml,
      styles: [formData.templateStyle],
    } as DocumentTemplate);
  }
}
