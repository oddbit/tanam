import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Document, DocumentStatus, DocumentType } from 'tanam-models';
import { ContentEntryService } from '../../../services/content-entry.service';
import { ContentTypeService } from '../../../services/content-type.service';
import { SiteService } from '../../../services/site.service';


interface StatusOption {
  title: string;
  value: DocumentStatus;
}

@Component({
  selector: 'app-content-entry-form',
  templateUrl: './content-entry-form.component.html',
  styleUrls: ['./content-entry-form.component.scss']
})
export class ContentEntryFormComponent implements OnInit, OnDestroy {
  @Input() document: Document;
  @Input() afterSaveRoute: string;
  @Input() onCancelRoute: string;

  private _rootSlug: string;
  metaDataDialog = false;
  publishedTime: Date;
  updatedTime: Date;
  createdTime: Date;
  domain$ = this.siteService.getPrimaryDomain();
  documentType$: Observable<DocumentType>;
  entryForm = this.formBuilder.group({
    title: [null, Validators.required],
    url: [null, Validators.required],
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

  private _documentTypeSubscription: Subscription;

  constructor(
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
    private readonly contentEntryService: ContentEntryService,
    private readonly documentTypeService: ContentTypeService,
    private readonly siteService: SiteService,
  ) { }


  ngOnInit() {
    this.entryForm.patchValue({
      title: this.document.title,
      url: this.document.url,
      status: this.document.status,
    });
    this.publishedTime = this.document.published && this.document.published.toDate();
    this.updatedTime = this.document.updated.toDate();
    this.createdTime = this.document.created.toDate();
    this.documentType$ = this.documentTypeService.getContentType(this.document.documentType);
    this._documentTypeSubscription = this.documentType$
      .subscribe(documentType => {
        this._rootSlug = documentType.slug;
        for (const field of documentType.fields) {
          if (this.dataForm.get(field.key)) {
            this.dataForm.setValue(this.document.data[field.key]);
          } else {
            const formControl = new FormControl(this.document.data[field.key]);
            this.dataForm.addControl(field.key, formControl);
          }
        }
      });
  }

  ngOnDestroy() {
    if (this._documentTypeSubscription && !this._documentTypeSubscription.closed) {
      this._documentTypeSubscription.unsubscribe();
    }
  }

  onTitleChange(title: string, isTitle: boolean) {
    if (!this.publishedTime && isTitle) {
      // Only auto slugify title if document has't been published before
      this.entryForm.controls['url'].setValue(`${this._rootSlug}/${this._slugify(title)}`);
      this.entryForm.controls['title'].setValue(title);
    } else if (isTitle) {
      this.entryForm.controls['title'].setValue(title);
    }
  }

  cancelEditing() {
    this.router.navigateByUrl(this.onCancelRoute);
  }

  closeDialog() {
    this.metaDataDialog = false;
  }

  showDialog() {
    this.metaDataDialog = true;
  }

  async deleteEntry() {
    await this.contentEntryService.delete(this.document.id);
    this.router.navigateByUrl(this.onCancelRoute);
  }

  async saveEntry() {
    const formData = this.entryForm.value;
    console.log(`[ContentEntryEditComponent:saveEntry] ${JSON.stringify(formData)}`);


    const updates = {
      id: this.document.id,
      title: formData.title,
      documentType: this.document.documentType,
      status: formData.status,
      data: this.dataForm.value,
      url: formData.url,
    } as Document;
    await this.contentEntryService.update(updates);


    if (!!this.afterSaveRoute) {
      this.router.navigateByUrl(this.afterSaveRoute);
    }
  }

  private _slugify(text: string) {
    return text.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  }
}
