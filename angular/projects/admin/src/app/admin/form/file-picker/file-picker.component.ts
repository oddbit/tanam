import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, ElementRef, HostBinding, Input, OnDestroy, Optional, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Observable, Subject } from 'rxjs';
import { FileType, TanamFile } from 'tanam-models';
import { UserFileService } from '../../../services/user-file.service';

@Component({
  selector: 'tanam-file-picker',
  templateUrl: './file-picker.component.html',
  styleUrls: ['./file-picker.component.scss'],
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: FilePickerComponent,
    },
  ],
})
export class FilePickerComponent implements MatFormFieldControl<string>, ControlValueAccessor, OnDestroy {
  private static _nextId = 0;

  @HostBinding('attr.aria-describedby') describedBy = '';
  @HostBinding() id = `tanam-file-picker-${FilePickerComponent._nextId++}`;

  @Input() fileType: FileType;

  file$: Observable<TanamFile>;
  stateChanges = new Subject<void>();
  controlType = 'tanam-file-picker';
  shouldLabelFloat = true;

  required: boolean;
  errorState: boolean;
  autofilled?: boolean;

  private _value: string;
  private _disabled = false;
  private _focused = false;
  private _placeholder: string;
  private _onTouchedCallback: () => void;
  private _onChangeCallback: (value: string) => void;

  constructor(
    @Optional() @Self() public ngControl: NgControl,
    private readonly focusMonitor: FocusMonitor,
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly fileService: UserFileService,
  ) {
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }

    focusMonitor.monitor(elementRef.nativeElement, true).subscribe(origin => {
      this.focused = !!origin;
      this.stateChanges.next();
    });
  }

  @Input()
  get placeholder() {
    return this._placeholder;
  }
  set placeholder(placeholder) {
    this._placeholder = placeholder;
    this.stateChanges.next();
  }

  get empty() {
    return !this._value || this._value.trim().length === 0;
  }

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(flag: boolean) {
    this._disabled = flag;
    this.stateChanges.next();
  }

  @Input()
  get value(): string {
    return this._value;
  }
  set value(value: string) {
    this._value = value;
    this.file$ = !!value ? this.fileService.getFile(value) : null;
    this.stateChanges.next();
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

  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }

  onContainerClick(event: MouseEvent): void {
    this._onTouchedCallback();
  }

  writeValue(text: string): void {
    this.value = text;
  }

  registerOnChange(callback: (val: string) => void): void {
    this._onChangeCallback = callback;
  }

  registerOnTouched(callback: () => void): void {
    this._onTouchedCallback = callback;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled = isDisabled;
  }

  removeAttachment() {
    this.value = null;
    this._onChangeCallback(null);
  }

  openFilePicker() {
    console.log('[openFilePicker]');
    const fileId = '273XtwTFD8SrlNoTOxtv'; // TODO: Deta, replace with modal result's file.id
    this._onChangeCallback(fileId);
    this.value = fileId;
  }
}