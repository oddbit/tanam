import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, ElementRef, HostBinding, Input, OnDestroy, Optional, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { MatFormFieldControl, MatSelectChange } from '@angular/material';
import { firestore } from 'firebase';
import { Observable, Subject } from 'rxjs';
import { TanamFile } from 'tanam-models';
import { UserFileService } from '../../../services/user-file.service';

@Component({
  selector: 'tanam-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: ImagePickerComponent,
    },
  ],
})
export class ImagePickerComponent implements MatFormFieldControl<firestore.DocumentReference>, ControlValueAccessor, OnDestroy {
  private static _nextId = 0;

  @HostBinding('attr.aria-describedby') describedBy = '';
  @HostBinding() id = `tanam-image-picker-${ImagePickerComponent._nextId++}`;
  controlType = 'tanam-image-picker';

  @Input() placeholder: string;

  errorState: boolean;
  autofilled?: boolean;

  image$: Observable<TanamFile>;
  stateChanges = new Subject<void>();
  readonly shouldLabelFloat = true;

  private _required = false;
  private _disabled = false;
  private _focused = false;
  private _value: firestore.DocumentReference;
  private _onTouchedCallback: () => void;
  private _onChangeCallback: (value: firestore.DocumentReference) => void;

  constructor(
    @Optional() @Self() public ngControl: NgControl,
    private readonly focusMonitor: FocusMonitor,
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly fileService: UserFileService,
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
  get value(): firestore.DocumentReference {
    return !this._value ? null : this._value;
  }

  set value(ref: firestore.DocumentReference) {
    this._value = ref;
    this.image$ = !!ref ? this.fileService.getFile(ref.id) : null;
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

  get empty() {
    return !this.value;
  }

  get focused() {
    return this._focused;
  }

  set focused(flag: boolean) {
    this._focused = coerceBooleanProperty(flag);
    this._onTouchedCallback();
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

  writeValue(ref: firestore.DocumentReference): void {
    this.value = ref;
  }

  registerOnChange(callback: (val: firestore.DocumentReference) => void): void {
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

  removeImage() {
    this.value = null;
  }

  openGalleyModal() {
    console.log('[openGalleyModal]');
  }
}
