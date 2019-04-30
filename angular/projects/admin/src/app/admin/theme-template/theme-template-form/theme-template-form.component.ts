import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ThemeTemplate } from 'tanam-models';
import { ThemeTemplateService } from '../../../services/theme-template.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { DialogConfirmService } from '../../../services/dialogConfirm.service';

@Component({
  selector: 'tanam-theme-template-form',
  templateUrl: './theme-template-form.component.html',
  styleUrls: ['./theme-template-form.component.scss']
})
export class ThemeTemplateFormComponent implements OnInit, OnDestroy {
  @Input() themeId: string;
  @Input() templateId: string;

  template: ThemeTemplate;
  readonly templateForm: FormGroup = this.formBuilder.group({
    title: [null, Validators.required],
    selector: [null, Validators.required],
    templateHtml: [null, Validators.required],
    templateStyle: null,
  });
  templateSubscription: Subscription;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly themeTemplateservice: ThemeTemplateService,
    private snackBar: MatSnackBar,
    private dialogConfirmService: DialogConfirmService
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
          templateStyle: template.styles ? template.styles[0] : null
        });
      });
  }

  ngOnDestroy() {
    if (this.templateSubscription && !this.templateSubscription.closed) {
      this.templateSubscription.unsubscribe();
    }
  }

  cancelEdit() {
    this.router.navigateByUrl(`/_/admin/theme/${this.themeId}`);
  }

  async saveTemplate() {
    const formData = this.templateForm.value;
    this.snackBar.open('Saving template', 'Dismiss', {
      duration: 1000,
    });
    await this.themeTemplateservice.saveTemplate(
      {
        id: this.templateId,
        title: formData.title,
        selector: formData.selector,
        template: formData.templateHtml,
        styles: [formData.templateStyle],
      } as ThemeTemplate, this.themeId as string
    );
    this.router.navigateByUrl(`/_/admin/theme/${this.themeId}`);
  }

  viewSelector() {
    alert('Viewing Selector');
  }

  deleteTemplate() {
    this.dialogConfirmService.openDialogConfirm({
      title: 'Delete Template',
      message: `Are you sure to delete the "${this.templateForm.controls['title'].value}" ?`,
      buttons: ['cancel', 'yes'],
      icon: 'warning'
    });
  }
}
