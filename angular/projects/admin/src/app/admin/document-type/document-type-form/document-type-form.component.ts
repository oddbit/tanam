import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { DocumentField, DocumentType, DocumentFieldFormElement } from 'tanam-models';
import { DocumentTypeService } from '../../../services/document-type.service';
import { SiteService } from '../../../services/site.service';
import { documentTypeMaterialIcons } from './document-type-form.icons';
import { MatDialog, MatSnackBar } from '@angular/material';
import { DialogService } from '../../../services/dialog.service';

interface FieldType {
  type: DocumentFieldFormElement;
  title: string;
}

@Component({
  selector: 'tanam-document-type-form',
  templateUrl: './document-type-form.component.html',
  styleUrls: ['./document-type-form.component.scss']
})
export class DocumentTypeFormComponent implements OnInit, OnDestroy, OnChanges {
  @Input() documentType: DocumentType;
  @Input() onCancelRoute: string;

  themeId: string;

  readonly domain$: Observable<string> = this.siteSettingsService.getPrimaryDomain();
  readonly icons = documentTypeMaterialIcons;
  readonly documentTypeForm: FormGroup = this.formBuilder.group({
    title: [null, Validators.required],
    slug: [null, Validators.required],
    icon: [null, Validators.required],
    description: [null, Validators.required],
    fields: this.formBuilder.array([], Validators.required),
    standalone: [false, Validators.required],
    indexTitle: []
  });
  readonly fieldTypes: FieldType[] = [
    { type: 'input-text', title: 'Single line of text' },
    { type: 'input-number', title: 'Input number on a line' },
    { type: 'textbox-plain', title: 'Box of plain text' },
    { type: 'textbox-rich', title: 'Rich text editor' },
    { type: 'date', title: 'Date picker' },
    { type: 'date-time', title: 'Date and time picker' },
    { type: 'document-reference', title: 'Document reference' },
    { type: 'image', title: 'Image' },
    { type: 'slide-toggle', title: 'Slide toggle value for yes/no' },
  ];

  private _subscriptions: Subscription[] = [];

  constructor(
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
    private readonly documentTypeService: DocumentTypeService,
    private readonly siteSettingsService: SiteService,
    private snackBar: MatSnackBar,
    private dialogService: DialogService
  ) { }

  ngOnInit() {
    console.log(`[ngOnInit] documentTypeId: ${JSON.stringify(this.documentType.id)}`);
    this._subscriptions.push(this.siteSettingsService.getSiteInfo().subscribe(settings => {
      this.themeId = settings.theme;
    }));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.documentType) {
      this.clearFields();
      for (let index = 0; index < this.documentType.fields.length; index++) {
        this.addField(this.documentType.fields[index], index);
      }

      this.documentTypeForm.patchValue({
        title: this.documentType.title,
        slug: this.documentType.slug,
        icon: this.documentType.icon,
        description: this.documentType.description,
        standalone: this.documentType.standalone
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
    this.router.navigateByUrl(`/_/admin/theme/${this.themeId}/templates/${this.documentTypeForm.controls['slug'].value}`);
  }

  addField(field?: DocumentField, index?: number) {
    const val = field ? field : { type: 'input-text' } as DocumentField;
    console.log(val);
    const formField = this.formBuilder.group({
      type: [val.type, Validators.required],
      title: [val.title, Validators.required],
      key: [val.key, Validators.required],
      isTitle: [val.isTitle, Validators.required],
    });
    if (val.isTitle) {
      this.documentTypeForm.controls['indexTitle'].setValue(index);
    }
    // If there was no field, this will create field with checked radio button
    if (this.fieldForms.length === 0) {
      this.documentTypeForm.controls['indexTitle'].setValue(0);
    }

    this.fieldForms.push(formField);
  }

  deleteField(index: number) {
    console.log(`Removing field ${index}: ${JSON.stringify(this.fieldForms.at(index).value)}`);
    const hasTitleIndex = this.documentTypeForm.controls['indexTitle'].value === index;
    const hasTitleValue = this.fieldForms.at(index).value.isTitle;
    if (hasTitleValue || hasTitleIndex) {
      // if deleted field has title value/index, the isTitle will be reset to first field
      this.documentTypeForm.controls['indexTitle'].setValue(0);
    }
    this.fieldForms.removeAt(index);
  }

  deleteContentTypeDialog() {
    this.dialogService.openDialogConfirm({
      title: 'Delete Content Type',
      message: `Are you sure to delete the "${this.documentTypeForm.controls['title'].value}" ?`,
      buttons: ['cancel', 'yes'],
      icon: 'warning'
    }).afterClosed().subscribe(async res => {
      if (res === 'yes') {
        this.snackBar.open('Deleting..', 'Dismiss', { duration: 2000 });
        await this.documentTypeService.delete(this.documentType.id);
        this.snackBar.open('Deleted', 'Dismiss', { duration: 2000 });
        this.cancelEditing();
      }
    });
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
    this.snackBar.open('Saving..', 'Dismiss', { duration: 2000 });
    const formData = this.documentTypeForm.value;
    for (let index = 0; index < this.fieldForms.value.length; index++) {
      this.fieldForms.at(index).patchValue({
        isTitle: index === formData.indexTitle
      });
    }

    if (this.fieldForms.length === 0) {
      this.snackBar.open('You must declare at least 1 field', 'Dismiss', { duration: 2000 });
      return;
    }

    if (this.documentTypeForm.errors) {
      this.snackBar.open('Form has errors', 'Dismiss', { duration: 2000 });
      return;
    }

    await this.documentTypeService.save({
      id: this.documentType.id,
      title: formData.title,
      slug: formData.slug || '',
      icon: formData.icon,
      description: formData.description,
      fields: this.fieldForms.value,
      standalone: formData.standalone
    } as DocumentType);
    this.snackBar.open('Saved', 'Dismiss', { duration: 2000 });
  }
}
