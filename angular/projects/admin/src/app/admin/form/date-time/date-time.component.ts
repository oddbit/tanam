import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, ElementRef, HostBinding, Input, OnDestroy, OnInit, Optional, Self, ViewChild } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { MAT_DATETIME_FORMATS } from '@mat-datetimepicker/core';
import { firestore } from 'firebase/app';
import * as moment from 'moment';
import { Subject } from 'rxjs';

@Component({
  selector: 'tanam-date-time',
  templateUrl: './date-time.component.html',
  styleUrls: ['./date-time.component.scss'],
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: DateTimeComponent,
    },
    {
      provide: MAT_DATETIME_FORMATS,
      useValue: {
        parse: {
          dateInput: 'YYYY-MM-DD',
          monthInput: 'MM',
          timeInput: 'HH:mm',
          datetimeInput: 'YYYY-MM-DD HH:mm'
        },
        display: {
          dateInput: 'YYYY-MM-DD',
          monthInput: 'MM',
          datetimeInput: 'YYYY-MM-DD HH:mm',
          timeInput: 'HH:mm',
          monthYearLabel: 'MM YYYY',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'MM YYYY',
          popupHeaderDateLabel: 'ddd, DD MM'
        }
      }
    },
  ],
})
export class DateTimeComponent implements MatFormFieldControl<firestore.Timestamp>, ControlValueAccessor, OnDestroy {

  private static _nextId = 0;

  @HostBinding('attr.aria-describedby') describedBy = '';
  @HostBinding() id = `date-time-${DateTimeComponent._nextId++}`;

  @Input() type: 'date-time' | 'date';

  stateChanges = new Subject<void>();
  controlType = 'date-time';
  shouldLabelFloat = false;

  required: boolean;
  errorState: boolean;
  autofilled?: boolean;
  timestamp: Date;

  private _disabled = false;
  private _focused = false;
  private _placeholder: string;
  private _onTouchedCallback: () => void;
  private _onChangeCallback: (value: firestore.Timestamp) => void;

  constructor(
    @Optional() @Self() public ngControl: NgControl,
    private readonly focusMonitor: FocusMonitor,
    private readonly elementRef: ElementRef<HTMLElement>,
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
    return !this.timestamp;
  }

  @Input()
  get disabled() {
    return this._disabled;
  }
  set disabled(flag) {
    this._disabled = flag;
    this.stateChanges.next();
  }

  @Input()
  get value(): firestore.Timestamp {
    return firestore.Timestamp.fromDate(this.timestamp);
  }

  set value(value: firestore.Timestamp) {
    this.timestamp = value.toDate();
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

  writeValue(timestamp: Date): void {
    this.timestamp = timestamp;
  }

  registerOnChange(callback: (val: firestore.Timestamp) => void): void {
    this._onChangeCallback = callback;
  }

  registerOnTouched(callback: () => void): void {
    this._onTouchedCallback = callback;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onContainerClick(event: MouseEvent): void {
    this._onTouchedCallback();
  }

  onChange($event: moment.MomentInput) {
    const toDate = moment($event).toDate();
    const toTimestamp = firestore.Timestamp.fromDate(toDate);
    this._onChangeCallback(toTimestamp);
    this.stateChanges.next();
  }
}
