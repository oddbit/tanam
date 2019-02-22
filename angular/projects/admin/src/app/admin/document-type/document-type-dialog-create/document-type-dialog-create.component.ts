import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DocumentTypeService } from '../../../services/document-type.service';

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
  ) { }

  createNewType() {
    const formData = this.createTypeForm.value;
    this.documentTypeService.create(formData.title);
  }

}
