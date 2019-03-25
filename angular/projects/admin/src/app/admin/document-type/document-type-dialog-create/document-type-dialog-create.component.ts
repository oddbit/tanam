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
    private readonly documentTypeService: DocumentTypeService,
    private dialogRef: MatDialogRef<DocumentTypeDialogCreateComponent>,
    private router: Router
  ) { }

  createNewType() {
    const title = this.createTypeForm.value.title;
    this.documentTypeService.createWithTitle(this._slugify(title), title);
    this.dialogRef.close();
    this.router.navigateByUrl(`/_/admin/type/${this._slugify(title)}/edit`);
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
