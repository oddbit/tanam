import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Subscription } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { DocumentStatus } from 'tanam-models';
import { DocumentTypeService } from '../../../services/document-type.service';
import { DocumentService } from '../../../services/document.service';
import { SiteService } from '../../../services/site.service';
import { firestore } from 'firebase/app';

interface StatusOption {
  title: string;
  value: DocumentStatus;
}

@Component({
  selector: 'tanam-document-edit',
  templateUrl: './document-edit.component.html',
  styleUrls: ['./document-edit.component.scss']
})
export class DocumentEditComponent implements OnInit, OnDestroy {
  readonly statusOptions: StatusOption[] = [
    { value: 'unpublished', title: 'Unpublished' },
    { value: 'published', title: 'Published' },
  ];

  readonly richTextEditorConfig = {
    // toolbar: ['heading', '|', 'bold', 'italic', '|', 'bulletedList', 'numberedList'],
  };

  readonly document$ = this.route.paramMap.pipe(switchMap(params => this.documentService.get(params.get('documentId'))));
  readonly documentType$ = this.document$.pipe(switchMap(document => this.documentTypeService.getDocumentType(document.documentType)));
  readonly domain$ = this.siteService.getPrimaryDomain();
  readonly documentForm = this.formBuilder.group({
    title: [null, Validators.required],
    url: [null, Validators.required],
    status: [null, Validators.required],
    published: [null],
    dataForm: this.formBuilder.group({}),
  });

  private _titleSubscription: Subscription;
  private readonly _subscriptions: Subscription[] = [];
  private _rootSlug: string;
  metaDataDialog = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly formBuilder: FormBuilder,
    private readonly siteService: SiteService,
    private readonly documentService: DocumentService,
    private readonly documentTypeService: DocumentTypeService,
  ) { }

  get dataForm() {
    return this.documentForm.get('dataForm') as FormGroup;
  }

  ngOnInit() {
    const combinedDocumentData$ = combineLatest(this.documentType$, this.document$);
    this._subscriptions.push(combinedDocumentData$.subscribe(([documentType, document]) => {
      if (this._titleSubscription && !this._titleSubscription.closed) {
        this._titleSubscription.unsubscribe();
      }

      this.documentForm.patchValue({
        title: document.title,
        url: document.url,
        status: document.status,
        published: document.published,
      });

      this._rootSlug = documentType.slug;
      for (const field of documentType.fields) {
        if (!this.dataForm.get(field.key)) {
          const formControl = new FormControl(document.data[field.key]);
          this.dataForm.addControl(field.key, formControl);
        }
        this.dataForm.patchValue({
          [field.key]: document.data[field.key],
        });

        if (field.isTitle) {
          this._titleSubscription = this.dataForm.get(field.key).valueChanges.subscribe(v => this._onTitleChange(v));
        }

        this._onChanges();
      }
    }));
  }

  private _onChanges() {
    const now = firestore.Timestamp.now();
    this.documentForm.valueChanges.subscribe(data => {
      if (!!data.published) {
        if (data.status === 'published' && data.published.seconds > now.seconds) {
          this.documentForm.controls['published'].setValue(null);
          this.documentForm.controls['status'].setValue('unpublished');
        } else if (data.status === 'unpublished' && data.published.seconds <= now.seconds) {
          this.documentForm.controls['published'].setValue(null);
          this.documentForm.controls['status'].setValue('published');
        }
      }
    });
  }



  ngOnDestroy() {
    this._subscriptions.push(this._titleSubscription);
    this._subscriptions.filter(s => !!s && !s.closed).forEach(s => s.unsubscribe());
  }

  async deleteEntry() {
    this._setStateProcessing(true);
    const document = await this.document$.pipe(take(1)).toPromise();
    await this.documentService.delete(document.id);
    this._navigateBack();
    this._setStateProcessing(false);
  }

  async saveEntry() {
    this._setStateProcessing(true);
    const formData = this.documentForm.value;

    const document = await this.document$.pipe(take(1)).toPromise();
    document.title = formData.title;
    document.status = formData.status;
    document.url = formData.url;
    document.published = formData.published;
    document.data = this._sanitizeData(this.dataForm.value);

    await this.documentService.update(document);
    this._navigateBack();
    this._setStateProcessing(false);
  }

  cancelEditing() {
    this._navigateBack();
  }

  closeDialog() {
    this.metaDataDialog = false;
  }

  showDialog() {
    this.metaDataDialog = true;
  }

  private _setStateProcessing(isProcessing: boolean) {
    // Blur inputs or something
  }

  private _sanitizeData(data: any) {
    for (const key in data) {
      if (data[key] === undefined) {
        data[key] = null;
      }
    }
    return data;
  }

  private _slugify(text: string) {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  }

  private _navigateBack() {
    // this.router.navigate(['../']);
  }

  private _onTitleChange(title: string) {
    if (!this.documentForm.get('published').value) {
      // Only auto slugify title if document has't been published before
      this.documentForm.controls['url'].setValue(`${this._rootSlug}/${this._slugify(title)}`);
      this.documentForm.controls['title'].setValue(title);
    }
  }
}
