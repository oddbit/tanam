import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { DocumentField, DocumentType } from 'tanam-models';
import { DocumentTypeService } from '../../../services/document-type.service';
import { SiteService } from '../../../services/site.service';
import { documentTypeMaterialIcons } from './document-type-form.icons';

@Component({
  selector: 'tanam-document-type-form',
  templateUrl: './document-type-form.component.html',
  styleUrls: ['./document-type-form.component.scss']
})
export class DocumentTypeFormComponent implements OnInit, OnDestroy, OnChanges {
  @Input() documentType: DocumentType;
  @Input() afterSaveRoute: string;
  @Input() onCancelRoute: string;

  themeId: string;

  readonly domain$: Observable<string> = this.siteSettingsService.getPrimaryDomain();
  readonly icons = documentTypeMaterialIcons;
  readonly documentTypeForm: FormGroup = this.formBuilder.group({
    title: [null, Validators.required],
    slug: [null, Validators.required],
    icon: [null, Validators.required],
    description: [null, Validators.required],
    fields: this.formBuilder.array([]),
  });
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

  private _subscriptions: Subscription[] = [];

  constructor(
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
    private readonly documentTypeService: DocumentTypeService,
    private readonly siteSettingsService: SiteService,
  ) { }

  ngOnInit() {
    console.log(`ngOnInit documentTypeId: ${this.documentType}`);

    this._subscriptions.push(this.siteSettingsService.getSiteInfo().subscribe(settings => {
      this.themeId = settings.theme;
    }));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.documentType) {
      this.clearFields();
      for (const field of this.documentType.fields) {
        this.addField(field);
      }

      this.documentTypeForm.patchValue({
        title: this.documentType.title,
        slug: this.documentType.slug,
        icon: this.documentType.icon,
        description: this.documentType.description,
      });
    }
  }

  ngOnDestroy(): void {
    this._subscriptions.filter(s => !!s && !s.closed).forEach(s => s.unsubscribe());
  }

  get fieldForms() {
    return this.documentTypeForm.get('fields') as FormArray;
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
      id: this.documentType.id,
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
