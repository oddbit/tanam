import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ContentTemplateService, ContentTemplate } from 'src/app/services/content-template.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-content-template-form',
  templateUrl: './content-template-form.component.html',
  styleUrls: ['./content-template-form.component.scss']
})
export class ContentTemplateFormComponent implements OnInit {
  templateId = this.route.snapshot.paramMap.get('templateId');
  readonly template$ = this.contentTemplateservice.getTemplate(this.templateId);
  readonly templateForm = this.fb.group({
    title: [null, Validators.required],
    selector: [null, Validators.required],
    templateHtml: [null, Validators.required],
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly contentTemplateservice: ContentTemplateService,
  ) { }

  ngOnInit() {
    this.template$.subscribe(template => {
      this.templateForm.patchValue({
        title: template.title,
        selector: template.selector,
        templateHtml: template.template,
      });
    });
  }

  onSubmit() {
    const formData = this.templateForm.value;
    this.contentTemplateservice.saveTemplate({
      id: this.templateId,
      title: formData.title,
      selector: formData.selector,
      template: formData.templateHtml,
    } as ContentTemplate);
  }
}
