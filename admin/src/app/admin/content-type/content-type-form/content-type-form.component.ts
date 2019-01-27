import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { ContentType, ContentTypeField, ContentTypeService } from '../../../services/content-type.service';
import { SiteSettingsService } from '../../../services/site-settings.service';
import { contentTypeMaterialIcons } from './content-type-form.icons';

@Component({
  selector: 'app-content-type-form',
  templateUrl: './content-type-form.component.html',
  styleUrls: ['./content-type-form.component.scss']
})
export class ContentTypeFormComponent implements OnInit, OnDestroy {
  @Input() contentTypeId: string;
  @Input() afterSaveRoute: string;
  @Input() onCancelRoute: string;

  readonly contentTypeForm: FormGroup = this.formBuilder.group({
    title: [null, Validators.required],
    slug: [null, Validators.required],
    icon: [null, Validators.required],
    description: [null, Validators.required],
    fields: this.formBuilder.array([]),
  });

  get fieldForms() {
    return this.contentTypeForm.get('fields') as FormArray;
  }

  readonly domain$: Observable<string> = this.siteSettingsService.getSiteDomain();
  readonly icons = contentTypeMaterialIcons;

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

  private contentTypeSubscription: Subscription;

  constructor(
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
    private readonly contentTypeService: ContentTypeService,
    private readonly siteSettingsService: SiteSettingsService,
  ) { }

  ngOnInit() {
    console.log(`ngOnInit contentTypeId: ${this.contentTypeId}`);
    const contentType$ = this.contentTypeService.getContentType(this.contentTypeId);
    this.contentTypeSubscription = contentType$.subscribe(contentType => {
      this.clearFields();
      for (const field of contentType.fields) {
        this.addField(field);
      }

      this.contentTypeForm.patchValue({
        title: contentType.title,
        slug: contentType.slug,
        icon: contentType.icon,
        description: contentType.description,
      });
    });
  }

  ngOnDestroy(): void {
    if (this.contentTypeSubscription && !this.contentTypeSubscription.closed) {
      this.contentTypeSubscription.unsubscribe();
    }
  }

  addField(field?: ContentTypeField) {
    const val = field ? field : { type: 'input-text' } as ContentTypeField;
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
    const formData = this.contentTypeForm.value;
    if (this.contentTypeForm.errors) {
      return;
    }

    await this.contentTypeService.saveContentType({
      id: this.contentTypeId,
      title: formData.title,
      slug: formData.slug || '',
      icon: formData.icon,
      description: formData.description,
      fields: this.fieldForms.value,
    } as ContentType);

    if (this.afterSaveRoute) {
      this.router.navigateByUrl(this.afterSaveRoute);
    }
  }
}
