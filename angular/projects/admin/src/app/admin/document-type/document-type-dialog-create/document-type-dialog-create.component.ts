import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DocumentTypeService } from '../../../services/document-type.service';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { AngularTanamDocumentType } from '../../../app.models';

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
    private router: Router,
  ) {}

  createNewType() {
    const title = this.createTypeForm.value.title;
    const documentType = AngularTanamDocumentType.withTitle(title);
    this.documentTypeService.save(documentType);
    this.dialogRef.close();
    this.router.navigateByUrl(`/_/admin/type/${documentType.id}/edit`);
  }
}
