import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ContentTypeService, ContentType } from 'src/app/services/content-type.service';
import { ContentEntryService, ContentEntry, ContentEntryStatus } from 'src/app/services/content-entry.service';
import { combineLatest, Subscription, Observable } from 'rxjs';
import { SiteSettingsService } from 'src/app/services/site-settings.service';


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
  @Input() contentTypeId: string;
  @Input() entryId: string;
  @Input() afterSaveRoute: string;
  @Input() onCancelRoute: string;

  readonly dataForm = this.formBuilder.group({});
  readonly entryForm = this.formBuilder.group({
    title: [null, Validators.required],
    urlRoot: [null, Validators.required],
    urlPath: [null, Validators.required],
    status: [null, Validators.required],
    dataForm: this.dataForm,
  });

  readonly statusOptions: StatusOption[] = [
    { value: 'unpublished', title: 'Unpublished' },
    { value: 'published', title: 'Published' },
  ];

  entry: ContentEntry;
  contentType: ContentType;
  isFormFieldDataLoaded = false;
  domain$ = this.siteSettingsService.getSiteDomain();

  private combinedDataSubscription: Subscription;

  constructor(
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
    private readonly ces: ContentEntryService,
    private readonly cts: ContentTypeService,
    private readonly siteSettingsService: SiteSettingsService,
  ) {
  }

  ngOnInit() {
    const entry$ = this.ces.getContentEntry(this.entryId);
    const contentType$ = this.cts.getContentType(this.contentTypeId);
    this.combinedDataSubscription = combineLatest(contentType$, entry$)
      .subscribe(([contentType, entry]) => this.onCompleteDataUpdate(contentType, entry));
  }

  ngOnDestroy() {
    if (this.combinedDataSubscription && !this.combinedDataSubscription.closed) {
      this.combinedDataSubscription.unsubscribe();
    }
  }

  private onCompleteDataUpdate(contentType: ContentType, entry: ContentEntry) {
    this.isFormFieldDataLoaded = false;
    this.contentType = contentType;
    this.entry = entry;
    for (const field of contentType.fields) {
      if (this.dataForm.contains(field.key)) {
        this.dataForm.patchValue({ [field.key]: entry.data[field.key] });
      } else {
        this.dataForm.addControl(field.key, new FormControl(entry.data[field.key]));
      }
    }

    this.entryForm.patchValue({
      title: entry.title,
      urlPath: entry.url.path,
      urlRoot: entry.url.root,
      status: entry.status,
    });

    this.isFormFieldDataLoaded = true;
  }

  cancelEditing() {
    this.router.navigateByUrl(this.onCancelRoute);
  }

  async saveEntry() {
    const formData = this.entryForm.value;
    console.log(`[ContentEntryEditComponent:saveEntry] ${JSON.stringify(formData)}`);

    await this.ces.saveContentEntry({
      id: this.entryId,
      title: formData.title,
      contentType: this.contentTypeId,
      url: {
        root: formData.urlRoot,
        path: formData.urlPath,
      },
      status: formData.status,
      data: this.dataForm.value
    } as ContentEntry);


    if (!!this.afterSaveRoute) {
      this.router.navigateByUrl(this.afterSaveRoute);
    }
  }
}
