import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ThemeTemplate } from 'tanam-models';
import { ThemeTemplateService } from '../../../services/theme-template.service';

@Component({
  selector: 'app-theme-template-form',
  templateUrl: './theme-template-form.component.html',
  styleUrls: ['./theme-template-form.component.scss']
})
export class ThemeTemplateFormComponent implements OnInit, OnDestroy {
  @Input() themeId: string;
  @Input() templateId: string;

  template: ThemeTemplate;
  readonly templateForm: FormGroup = this.fb.group({
    title: [null, Validators.required],
    selector: [null, Validators.required],
    templateHtml: [null, Validators.required],
    templateStyle: null,
  });
  templateSubscription: Subscription;

  constructor(
    private readonly fb: FormBuilder,
    private readonly themeTemplateservice: ThemeTemplateService,
  ) { }

  ngOnInit() {
    this.templateSubscription = this.themeTemplateservice
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
    this.themeTemplateservice.saveTemplate({
      id: this.templateId,
      title: formData.title,
      selector: formData.selector,
      template: formData.templateHtml,
      styles: [formData.templateStyle],
    } as ThemeTemplate);
  }
}
