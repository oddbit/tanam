import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ContentTypeService, ContentType } from 'src/app/services/content-type.service';
import { ContentEntryService, ContentEntry } from 'src/app/services/content-entry.service';
import { combineLatest, Subscription } from 'rxjs';

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

  readonly entry$ = this.ces.getContentEntry(this.contentTypeId, this.entryId);
  readonly contentType$ = this.cts.getContentType(this.contentTypeId);
  private combinedDataSubscription: Subscription;

  readonly dataForm = this.formBuilder.group({});
  readonly entryForm = this.formBuilder.group({
    title: [null, Validators.required],
    urlPath: [null, Validators.required],
    status: [null, Validators.required],
  });

  constructor(
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
    private readonly ces: ContentEntryService,
    private readonly cts: ContentTypeService,
  ) { }

  ngOnInit() {
    this.combinedDataSubscription = combineLatest(this.contentType$, this.entry$)
      .subscribe(([contentType, entry]) => this.onCompleteDataUpdate(contentType, entry));
  }

  ngOnDestroy() {
    if (this.combinedDataSubscription && !this.combinedDataSubscription.closed) {
      this.combinedDataSubscription.unsubscribe();
    }
  }

  onSubmit() {
    alert('Thanks!');
  }

  private onCompleteDataUpdate(contentType: ContentType, entry: ContentEntry) {
    for (const field of contentType.fields) {
      if (this.dataForm.contains(field.key)) {
        this.dataForm.setControl(field.key, new FormControl(entry.data[field.key]));
      } else {
        this.dataForm.addControl(field.key, new FormControl(entry.data[field.key]));
      }
    }

    this.entryForm.patchValue({
      urlPath: entry.url.path,
      status: entry.status,
    });
  }

  cancelEditing() {
    this.router.navigateByUrl(this.onCancelRoute);
  }

  async saveEntry() {
    const formData = this.entryForm.value;
    console.log(`[ContentEntryEditComponent:saveEntry] ${JSON.stringify(formData)}`);

    await this.ces.saveContentEntry({
      id: this.entryId,
      contentType: this.contentTypeId,
      url: {
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
