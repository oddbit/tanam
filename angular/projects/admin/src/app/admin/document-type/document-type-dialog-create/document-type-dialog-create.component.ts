import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DocumentTypeService } from '../../../services/document-type.service';
import { MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'tanam-document-type-dialog-create',
  templateUrl: './document-type-dialog-create.component.html',
  styleUrls: ['./document-type-dialog-create.component.scss']
})
export class DocumentTypeDialogCreateComponent {
  readonly createTypeForm: FormGroup = this.formBuilder.group({
    title: [null, [Validators.required]],
  });

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly documentTypeService: DocumentTypeService,
    private dialogRef: MatDialogRef<DocumentTypeDialogCreateComponent>,
  ) { }

  createNewType() {
    const formData = this.createTypeForm.value;
    this.documentTypeService.create(formData.title, this._slugify(formData.title));
    this.router.navigateByUrl(`/_/admin/type/${this._slugify(formData.title)}/edit`);
    this.dialogRef.close();
  }

  private _slugify(text: string) {
    return text.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  }

}
