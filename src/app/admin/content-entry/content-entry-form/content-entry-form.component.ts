import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormArray, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { combineLatest, Subscription, of, Observable } from 'rxjs';
import { ContentEntry, ContentEntryService, ContentEntryStatus } from '../../../services/content-entry.service';
import { ContentType, ContentTypeService } from '../../../services/content-type.service';
import { SiteSettingsService } from '../../../services/site-settings.service';


interface StatusOption {
  title: string;
  value: ContentEntryStatus;
}

@Component({
  selector: 'app-content-entry-form',
  templateUrl: './content-entry-form.component.html',
  styleUrls: ['./content-entry-form.component.scss']
})
export class ContentEntryFormComponent implements OnInit, OnDestroy {
  @Input() contentEntry: ContentEntry;
  @Input() afterSaveRoute: string;
  @Input() onCancelRoute: string;

  domain$ = this.siteSettingsService.getSiteDomain();
  contentType$: Observable<ContentType>;
  entryForm = this.formBuilder.group({
    title: [null, Validators.required],
    urlPath: [null, Validators.required],
    status: [null, Validators.required],
    dataForm: this.formBuilder.group({}),
  });

  readonly richTextEditorConfig = {
    // toolbar: ['heading', '|', 'bold', 'italic', '|', 'bulletedList', 'numberedList'],
  };

  get dataForm() {
    return this.entryForm.get('dataForm') as FormGroup;
  }

  readonly statusOptions: StatusOption[] = [
    { value: 'unpublished', title: 'Unpublished' },
    { value: 'published', title: 'Published' },
  ];

  private _contentTypeSubscription: Subscription;

  constructor(
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
    private readonly contentEntryService: ContentEntryService,
    private readonly contentTypeService: ContentTypeService,
    private readonly siteSettingsService: SiteSettingsService,
  ) { }


  ngOnInit() {
    this.entryForm.patchValue({
      title: this.contentEntry.title,
      urlPath: this.contentEntry.url.path,
      status: this.contentEntry.status,
    });
    this.contentType$ = this.contentTypeService.getContentType(this.contentEntry.contentType);
    this._contentTypeSubscription = this.contentType$
      .subscribe(contentType => {
        for (const field of contentType.fields) {
          if (this.dataForm.get(field.key)) {
            this.dataForm.setValue(this.contentEntry.data[field.key]);
          } else {
            const formControl = new FormControl(this.contentEntry.data[field.key]);
            this.dataForm.addControl(field.key, formControl);
          }
        }
      });
  }

  ngOnDestroy() {
    if (this._contentTypeSubscription && !this._contentTypeSubscription.closed) {
      this._contentTypeSubscription.unsubscribe();
    }
  }
  cancelEditing() {
    this.router.navigateByUrl(this.onCancelRoute);
  }

  async saveEntry() {
    const formData = this.entryForm.value;
    console.log(`[ContentEntryEditComponent:saveEntry] ${JSON.stringify(formData)}`);


    const updates = {
      id: this.contentEntry.id,
      title: formData.title,
      contentType: this.contentEntry.contentType,
      status: formData.status,
      data: this.dataForm.value,
      url: {
        root: this.contentEntry.url.root,
        path: formData.urlPath,
      },
    } as ContentEntry;
    await this.contentEntryService.update(updates);


    if (!!this.afterSaveRoute) {
      this.router.navigateByUrl(this.afterSaveRoute);
    }
  }
}
