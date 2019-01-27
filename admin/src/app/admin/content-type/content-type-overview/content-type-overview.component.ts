import { Component, OnInit } from '@angular/core';
import { ContentTypeService } from '../../../services/content-type.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-content-type-overview',
  templateUrl: './content-type-overview.component.html',
  styleUrls: ['./content-type-overview.component.scss']
})
export class ContentTypeOverviewComponent implements OnInit {
  readonly createTypeForm: FormGroup = this.formBuilder.group({
    title: [null, [Validators.required]],
  });

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly contentTypeService: ContentTypeService,
  ) { }

  ngOnInit() {
  }

  createNewType() {
    const formData = this.createTypeForm.value;
    this.contentTypeService.createContentType(formData.title);
  }
}
