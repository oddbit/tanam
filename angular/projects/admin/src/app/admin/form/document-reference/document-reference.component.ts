import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, ElementRef, HostBinding, Input, OnDestroy, OnInit, Optional, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { MatSelectChange } from '@angular/material/select';
import { Observable, Subject } from 'rxjs';
import { ITanamDocument, DocumentStatus } from 'tanam-models';
import { DocumentService } from '../../../services/document.service';

@Component({
  selector: 'tanam-document-reference',
  templateUrl: './document-reference.component.html',
  styleUrls: ['./document-reference.component.scss'],
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: DocumentReferenceComponent,
    },
  ],
})
export class DocumentReferenceComponent implements MatFormFieldControl<string>, ControlValueAccessor, OnInit, OnDestroy {
  private static _nextId = 0;

  @HostBinding('attr.aria-describedby') describedBy = '';
  @HostBinding() id = `tanam-document-reference-${DocumentReferenceComponent._nextId++}`;
  controlType = 'document-reference';

  @Input() documentType: string;
  @Input() status: DocumentStatus = 'published';
  @Input() placeholder: string;

  errorState: boolean;
  autofilled?: boolean;

  stateChanges = new Subject<void>();
  documentOptions$: Observable<ITanamDocument[]>;

  private _required = false;
  private _disabled = false;
  private _value: string;
  private _focused = false;
  private _onTouchedCallback: () => void;
  private _onChangeCallback: (value: string) => void;

  constructor(
    @Optional() @Self() public ngControl: NgControl,
    private readonly focusMonitor: FocusMonitor,
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly documentService: DocumentService,
  ) {
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }

    this.focusMonitor.monitor(this.elementRef.nativeElement, true).subscribe(origin => {
      this.focused = !!origin;
      this.stateChanges.next();
    });
  }

  @Input()
  get disabled(): boolean { return this._disabled; }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this.stateChanges.next();
  }

  @Input()
  get value(): string {
    return this._value || null;
  }
  set value(value: string) {
    this._value = !!value && value.trim().length > 0 ? value : null;
    this.stateChanges.next();
  }

  @Input()
  get required() {
    return this._required;
  }
  set required(req) {
    this._required = coerceBooleanProperty(req);
    this.stateChanges.next();
  }

  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  get empty() {
    return !this._value;
  }

  get focused() {
    return this._focused;
  }

  set focused(flag: boolean) {
    this._focused = coerceBooleanProperty(flag);
    this._onTouchedCallback();
  }

  ngOnInit() {
    console.log(this.status);
    this.documentOptions$ = this.documentService.query(this.documentType, {
      orderBy: {
        field: 'title',
        sortOrder: 'asc',
      },
      status: this.status,
    });
  }

  ngOnDestroy() {
    this.stateChanges.complete();
    this.focusMonitor.stopMonitoring(this.elementRef.nativeElement);
  }

  setDescribedByIds(ids: string[]): void {
    this.describedBy = ids.join(' ');
  }

  onContainerClick(event: MouseEvent): void {
    this._onTouchedCallback();
  }

  writeValue(document: string): void {
    this.value = document;
  }

  registerOnChange(callback: (val: string) => void): void {
    this._onChangeCallback = callback;
  }

  registerOnTouched(callback: () => void): void {
    this._onTouchedCallback = callback;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onChange(changeEvent: MatSelectChange) {
    this._onChangeCallback(changeEvent.value);
    this.stateChanges.next();
  }
}
