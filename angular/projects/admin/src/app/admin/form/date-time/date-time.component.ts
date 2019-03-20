import { Component, OnInit, Input, OnDestroy, HostBinding, Optional, Self, ElementRef, ViewChild } from '@angular/core';
import { MatFormFieldControl } from '@angular/material';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import * as moment from 'moment';
import { firestore } from 'firebase/app';

@Component({
  selector: 'tanam-date-time',
  templateUrl: './date-time.component.html',
  styleUrls: ['./date-time.component.scss'],
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: DateTimeComponent,
    },
  ],
})
export class DateTimeComponent implements MatFormFieldControl<firestore.Timestamp>, ControlValueAccessor, OnInit, OnDestroy {

  private static _nextId = 0;

  @HostBinding('attr.aria-describedby') describedBy = '';
  @HostBinding() id = `date-time-${DateTimeComponent._nextId++}`;
  @ViewChild('container', { read: ElementRef }) container: ElementRef;


  @Input() type: string;
  @Input() title: string;
  @Input() key: string;


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
  private _onChangeCallback: (value: any) => void;

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

  ngOnInit() {
  }

  inputChange($event: moment.MomentInput ) {
    const toDate = moment($event).toDate();
    const toTimestamp = firestore.Timestamp.fromDate(toDate);
    this._onChangeCallback(toTimestamp);
    this.stateChanges.next();
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

  writeValue(timestamp: firestore.Timestamp): void {
    this.timestamp = timestamp && timestamp.toDate() || new Date();
  }

  registerOnChange(callback: (val: firestore.Timestamp) => void): void {
    this._onChangeCallback = callback;
  }

  registerOnTouched(callback: () => void): void {
    this._onTouchedCallback = callback;
  }

  setDisabledState(isDisabled: boolean): void {
    console.log('disable');
  }

}
