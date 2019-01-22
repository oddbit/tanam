import { Component, OnInit } from '@angular/core';
import { ContentTypeService } from '../../../services/content-type.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-content-type-overview',
  templateUrl: './content-type-overview.component.html',
  styleUrls: ['./content-type-overview.component.scss']
})
export class ContentTypeOverviewComponent implements OnInit {
  readonly createTypeForm = this.formBuilder.group({
    title: [null, [Validators.required]],
  });

  get formControls() {
    return this.createTypeForm.controls;
  }
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
