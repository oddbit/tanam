import { Component, OnInit, isDevMode } from '@angular/core';
import { ContentTypeEntryService, ContentTypeEntry } from '../content-type-entry/content-type-entry.service';
import { ContentTypeFieldService, ContentTypeField } from '../content-type-field/content-type-field.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, combineLatest } from 'rxjs';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { map, withLatestFrom } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-content-type-entry-edit',
  templateUrl: './content-type-entry-edit.component.html',
  styleUrls: ['./content-type-entry-edit.component.scss']
})
export class ContentTypeEntryEditComponent implements OnInit {
  readonly contentTypeId: string;
  readonly entryId: string;

  readonly entry$: Observable<ContentTypeEntry>;
  readonly fields$: Observable<ContentTypeField[]>;

  // Use this one for the template form iteration,
  // just because I couldn't come up with a good way to check both
  // observables ready before trying to iterate the form
  entryFields: ContentTypeField[] = [];

  readonly isDevelopment = !environment.production;

  private _entryForm: FormGroup;

  constructor(
    private readonly formBuilder: FormBuilder,
    readonly route: ActivatedRoute,
    readonly ctes: ContentTypeEntryService,
    private readonly ctfs: ContentTypeFieldService,
  ) {
    this.contentTypeId = route.snapshot.paramMap.get('typeId');
    this.entryId = route.snapshot.paramMap.get('entryId');
    this._entryForm = this.formBuilder.group({});

    this.entry$ = ctes.getContentTypeEntry(this.contentTypeId, this.entryId);
    this.fields$ = this.ctfs.getContentTypeFields(this.contentTypeId);

    combineLatest(this.entry$, this.fields$).subscribe(([entry, fields]) => {
      console.log(`[ContentTypeEntryEditComponent] fields: ${JSON.stringify(fields)}`);
      console.log(`[ContentTypeEntryEditComponent] entry: ${JSON.stringify(entry)}`);
      for (const field of fields) {
        if (this._entryForm.contains(field.key)) {
          this._entryForm.removeControl(field.key);
        }

        this._entryForm.addControl(field.key, new FormControl(entry.data[field.key]));
      }

      this.entryFields = fields.slice();
    });
  }

  ngOnInit() {
  }

  get entryForm() {
    return this._entryForm;
  }
}
