import { Component, OnInit } from '@angular/core';
import { ContentEntryService, ContentEntry } from '../../services/content-entry.service';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { ContentTypeService, ContentType } from '../../services/content-type.service';

@Component({
  selector: 'app-content-entry-edit',
  templateUrl: './content-entry-edit.component.html',
  styleUrls: ['./content-entry-edit.component.scss']
})
export class ContentEntryEditComponent implements OnInit {
  readonly contentTypeId = this.route.snapshot.paramMap.get('typeId');
  readonly entryId = this.route.snapshot.paramMap.get('entryId');
  readonly isDevelopment = !environment.production;
  readonly dataForm = this.formBuilder.group({});
  readonly entryForm = this.formBuilder.group({
    path: [null, [Validators.required]],
    status: [null, [Validators.required]],
    data: this.dataForm,
  });

  contentType: ContentType;
  entry: ContentEntry;
  isFormFieldDataLoaded = false;

  constructor(
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
    private readonly ces: ContentEntryService,
    private readonly cts: ContentTypeService,
    private readonly route: ActivatedRoute,
  ) { }

  ngOnInit() {
    const entry$ = this.ces.getContentEntry(this.contentTypeId, this.entryId);
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
          path: entry.url.path,
          status: entry.status,
        });
        this.isFormFieldDataLoaded = true;
      });
  }

  cancelEditing() {
    this.router.navigateByUrl(`/admin/content/type/${this.contentTypeId}`);
  }

  saveEntry() {
    const formData = this.entryForm.value;
    console.log(`[ContentEntryEditComponent:saveEntry] ${JSON.stringify(formData)}`);

    this.ces.saveContentEntry({
      id: this.entryId,
      contentType: this.contentTypeId,
      url: {
        path: formData.path,
      },
      status: formData.status,
      data: this.dataForm.value
    } as ContentEntry);
  }
}
