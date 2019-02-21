import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContentTypeService } from '../../../services/content-type.service';

@Component({
  selector: 'app-content-type-overview',
  templateUrl: './content-type-overview.component.html',
  styleUrls: ['./content-type-overview.component.scss']
})
export class ContentTypeOverviewComponent {
  readonly createTypeForm: FormGroup = this.formBuilder.group({
    title: [null, [Validators.required]],
  });

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly documentTypeService: ContentTypeService,
  ) {
  }

  createNewType() {
    const formData = this.createTypeForm.value;
    this.documentTypeService.create(formData.title);
  }
}
