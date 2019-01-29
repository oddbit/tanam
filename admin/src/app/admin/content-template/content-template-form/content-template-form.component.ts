import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ContentTemplate, ContentTemplateService } from 'tanam-core';

@Component({
  selector: 'app-content-template-form',
  templateUrl: './content-template-form.component.html',
  styleUrls: ['./content-template-form.component.scss']
})
export class ContentTemplateFormComponent implements OnInit, OnDestroy {
  @Input() templateId: string;

  template: ContentTemplate;
  readonly templateForm: FormGroup = this.fb.group({
    title: [null, Validators.required],
    selector: [null, Validators.required],
    templateHtml: [null, Validators.required],
  });
  templateSubscription: Subscription;

  constructor(
    private readonly fb: FormBuilder,
    private readonly contentTemplateservice: ContentTemplateService,
  ) { }

  ngOnInit() {

    this.templateSubscription = this.contentTemplateservice.getTemplate(this.templateId)
      .subscribe(template => {
        this.template = template;
        this.templateForm.patchValue({
          title: template.title,
          selector: template.selector,
          templateHtml: template.template,
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
    } as ContentTemplate);
  }
}
