import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { DocumentTypeService } from '../../../services/document-type.service';
import { DocumentTypeDialogCreateComponent } from '../../document-type/document-type-dialog-create/document-type-dialog-create.component';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'tanam-theme-template-dialog-create',
  templateUrl: './theme-template-dialog-create.component.html',
  styleUrls: ['./theme-template-dialog-create.component.scss']
})
export class ThemeTemplateDialogCreateComponent {
  readonly createTemplateForm: FormGroup = this.formBuilder.group({
    title: [null, [Validators.required]],
    selector: [null, [Validators.required]],
  });

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly documentTypeService: DocumentTypeService,
    private dialogRef: MatDialogRef<DocumentTypeDialogCreateComponent>,
    private router: Router,
  ) { }

  createNewTemplate () {
    alert();
    console.log(this.createTemplateForm)
  }
}
