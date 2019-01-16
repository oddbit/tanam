import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ContentTypeService, ContentType, ContentTypeField } from '../../services/content-type.service';
import { FormBuilder, FormArray, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-content-type-edit',
  templateUrl: './content-type-edit.component.html',
  styleUrls: ['./content-type-edit.component.scss']
})
export class ContentTypeEditComponent implements OnInit {
  private readonly contentTypeId = this.route.snapshot.paramMap.get('typeId');
  readonly contentType$ = this.cts.getContentType(this.contentTypeId);
  readonly contentTypeForm = this.formBuilder.group({
    title: [],
    slug: [],
    icon: [],
    description: [],
    fields: this.formBuilder.array([]),
  });

  constructor(
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly cts: ContentTypeService,
  ) { }

  ngOnInit() {
    this.contentType$.subscribe(contentType => {
      for (const field of contentType.fields) {
        this.addField(field);
      }

      this.contentTypeForm.patchValue({
        title: contentType.title,
        slug: contentType.slug,
        icon: contentType.icon,
        description: contentType.description,
      });
    });
  }

  get fieldForms() {
    return this.contentTypeForm.get('fields') as FormArray;
  }

  addField(field?: ContentTypeField) {
    const val = field ? field : { type: 'text-line' } as ContentTypeField;
    const formField = this.formBuilder.group({
      type: [val.type],
      title: [val.title],
      key: [val.key],
    });

    this.fieldForms.push(formField);
  }

  deleteField(index) {
    this.fieldForms.removeAt(index);
  }

  cancelEditing() {
    this.router.navigateByUrl(`/_/admin/content/type/${this.contentTypeId}`);
  }

  saveEntry() {
    const formData = {};
    console.log(`[ContentTypeEditComponent:saveEntry] ${JSON.stringify(formData)}`);
  }
}
