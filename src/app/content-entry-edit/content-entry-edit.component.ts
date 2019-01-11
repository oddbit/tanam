import { Component, OnInit } from '@angular/core';
import { ContentEntryService, ContentEntry } from '../content-entry/content-entry.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, combineLatest } from 'rxjs';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { ContentTypeService, ContentType } from '../content-type/content-type.service';

@Component({
  selector: 'app-content-entry-edit',
  templateUrl: './content-entry-edit.component.html',
  styleUrls: ['./content-entry-edit.component.scss']
})
export class ContentEntryEditComponent implements OnInit {
  readonly contentTypeId: string;
  readonly entryId: string;
  readonly isDevelopment = !environment.production;
  readonly entryForm: FormGroup;
  readonly dataForm: FormGroup;

  contentType: ContentType;
  entry: ContentEntry;
  isFormFieldDataLoaded = false;


  constructor(
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
    private readonly ctes: ContentEntryService,
    private readonly cts: ContentTypeService,
    private readonly route: ActivatedRoute,
  ) {
    this.contentTypeId = route.snapshot.paramMap.get('typeId');
    this.entryId = route.snapshot.paramMap.get('entryId');
    this.dataForm = this.formBuilder.group({});
    this.entryForm = this.formBuilder.group({
      slug: [null, [Validators.required]],
      status: [null, [Validators.required]],
      data: this.dataForm,
    });

  }

  ngOnInit() {
    const entry$ = this.ctes.getContentEntry(this.contentTypeId, this.entryId);
    const contentType$ = this.cts.getContentType(this.contentTypeId);

    combineLatest(entry$, contentType$)
      .subscribe(([entry, contentType]) => {
        this.isFormFieldDataLoaded = false;
        this.contentType = contentType;
        this.entry = entry;

        for (const field of contentType.fields) {
          if (this.dataForm.contains(field.key)) {
            this.dataForm.setControl(field.key, new FormControl(entry.data[field.key]));
          } else {
            this.dataForm.addControl(field.key, new FormControl(entry.data[field.key]));
          }
        }

        this.entryForm.patchValue({
          slug: entry.slug,
          status: entry.status,
        });
        this.isFormFieldDataLoaded = true;
      });
  }

  cancelEditing() {
    this.router.navigateByUrl(`/admin/content/${this.contentTypeId}`);
  }

  saveEntry() {
    const formData = this.entryForm.value;
    console.log(`[ContentEntryEditComponent:saveEntry] ${JSON.stringify(formData)}`);
  }
}
