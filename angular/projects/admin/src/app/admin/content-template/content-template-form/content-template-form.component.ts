import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DocumentTemplate } from 'tanam-models';
import { ContentTemplateService } from '../../../services/content-template.service';
import { SiteThemeService } from '../../../services/site-theme.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-content-template-form',
  templateUrl: './content-template-form.component.html',
  styleUrls: ['./content-template-form.component.scss']
})
export class ContentTemplateFormComponent implements OnInit, OnDestroy {
  @Input() themeId: string;
  @Input() templateId: string;
  theme: string;

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
    private readonly router: Router,
    private readonly contentTemplateservice: ContentTemplateService,
    private readonly siteThemeservice: SiteThemeService,
  ) { }

  ngOnInit() {
    this.siteThemeservice.getTheme(this.themeId)
      .subscribe(theme => this.theme = theme.title);

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

  backToTheme() {
    this.router.navigateByUrl(`/_/admin/themes/${this.themeId}`);
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
