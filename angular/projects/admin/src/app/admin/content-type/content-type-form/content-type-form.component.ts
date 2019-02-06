import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { DocumentType, DocumentField } from 'tanam-models';
import { ContentTypeService } from '../../../services/content-type.service';
import { SiteService } from '../../../services/site.service';
import { documentTypeMaterialIcons } from './content-type-form.icons';
import { SiteThemeService } from '../../../services/site-theme.service';

@Component({
  selector: 'app-content-type-form',
  templateUrl: './content-type-form.component.html',
  styleUrls: ['./content-type-form.component.scss']
})
export class ContentTypeFormComponent implements OnInit, OnDestroy {
  @Input() documentTypeId: string;
  @Input() afterSaveRoute: string;
  @Input() onCancelRoute: string;

  themeId: string;

  readonly documentTypeForm: FormGroup = this.formBuilder.group({
    title: [null, Validators.required],
    slug: [null, Validators.required],
    icon: [null, Validators.required],
    description: [null, Validators.required],
    fields: this.formBuilder.array([]),
  });

  get fieldForms() {
    return this.documentTypeForm.get('fields') as FormArray;
  }

  readonly domain$: Observable<string> = this.siteSettingsService.getPrimaryDomain();
  readonly icons = documentTypeMaterialIcons;

  readonly fieldTypes = [
    { type: 'input-text', title: 'Single line of text' },
    { type: 'input-number', title: 'Input number on a line' },
    { type: 'textbox-plain', title: 'Box of plain text' },
    { type: 'textbox-rich', title: 'Rich text editor' },
    { type: 'date', title: 'Date picker' },
    { type: 'time', title: 'Time picker' },
    { type: 'date-time', title: 'Date and time picker' },
    { type: 'slide-toggle', title: 'Slide toggle value for yes/no' },
  ];

  private documentTypeSubscription: Subscription;

  constructor(
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
    private readonly documentTypeService: ContentTypeService,
    private readonly siteSettingsService: SiteService,
  ) { }

  ngOnInit() {
    console.log(`ngOnInit documentTypeId: ${this.documentTypeId}`);

    this.siteSettingsService.getSiteInfo().subscribe(settings => {
      console.log(`[SettingsSiteComponent] site settings: ${JSON.stringify(settings)}`);
      console.log(settings);
      this.themeId = settings.theme;
    });

    const documentType$ = this.documentTypeService.getContentType(this.documentTypeId);
    this.documentTypeSubscription = documentType$.subscribe(documentType => {
      this.clearFields();
      for (const field of documentType.fields) {
        this.addField(field);
      }

      this.documentTypeForm.patchValue({
        title: documentType.title,
        slug: documentType.slug,
        icon: documentType.icon,
        description: documentType.description,
      });
    });
  }

  ngOnDestroy(): void {
    if (this.documentTypeSubscription && !this.documentTypeSubscription.closed) {
      this.documentTypeSubscription.unsubscribe();
    }
  }

  editTemplate() {
    this.router.navigateByUrl(`/_/admin/themes/${this.themeId}/templates/${this.documentTypeForm.controls['slug'].value}`);
  }

  addField(field?: DocumentField) {
    const val = field ? field : { type: 'input-text' } as DocumentField;
    const formField = this.formBuilder.group({
      type: [val.type, Validators.required],
      title: [val.title, Validators.required],
      key: [val.key, Validators.required],
    });

    this.fieldForms.push(formField);
  }

  deleteField(index: number) {
    console.log(`Removing field ${index}: ${JSON.stringify(this.fieldForms.at(index).value)}`);
    this.fieldForms.removeAt(index);
  }

  clearFields() {
    while (this.fieldForms.length > 0) {
      this.deleteField(0);
    }
  }

  cancelEditing() {
    this.router.navigateByUrl(this.onCancelRoute);
  }

  async save() {
    const formData = this.documentTypeForm.value;
    if (this.documentTypeForm.errors) {
      return;
    }

    await this.documentTypeService.save({
      id: this.documentTypeId,
      title: formData.title,
      slug: formData.slug || '',
      icon: formData.icon,
      description: formData.description,
      fields: this.fieldForms.value,
    } as DocumentType);

    if (this.afterSaveRoute) {
      this.router.navigateByUrl(this.afterSaveRoute);
    }
  }
}
