import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DocumentTypeService } from '../../../services/document-type.service';

@Component({
  selector: 'app-document-type-overview',
  templateUrl: './document-type-overview.component.html',
  styleUrls: ['./document-type-overview.component.scss']
})
export class DocumentTypeOverviewComponent {
  readonly createTypeForm: FormGroup = this.formBuilder.group({
    title: [null, [Validators.required]],
  });

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly documentTypeService: DocumentTypeService,
  ) {
  }

  createNewType() {
    const formData = this.createTypeForm.value;
    this.documentTypeService.create(formData.title);
  }
}
