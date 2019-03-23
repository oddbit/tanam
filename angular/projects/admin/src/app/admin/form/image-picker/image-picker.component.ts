import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, ElementRef, HostBinding, Input, OnDestroy, OnInit, Optional, Self } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { MatFormFieldControl, MatSelectChange } from '@angular/material';
import { from, Observable, Subject, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UserFileService } from '../../../services/user-file.service';
import { TanamFile } from 'tanam-models';

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
export class ImagePickerComponent implements MatFormFieldControl<string>, ControlValueAccessor, OnDestroy {
  private static _nextId = 0;

  @HostBinding('attr.aria-describedby') describedBy = '';
  @HostBinding() id = `date-time-${ImagePickerComponent._nextId++}`;
  controlType = 'tanam-image-picker';

  @Input() placeholder: string;

  focused: boolean;
  errorState: boolean;
  autofilled?: boolean;

  // valueStream = new Subject<string>();
  stateChanges = new Subject<void>();
  image$ = of({
    id: 'foo',
    title: 'Foo image',
  } as TanamFile);
  // readonly imageUrl$: Observable<string> = this.valueStream
  //   .pipe(switchMap(id => this.fileService.getFile(id)))
  //   .pipe(switchMap(file => from(this.fireStorage.ref(file.variants['medium']).getDownloadURL())));


  private _required = false;
  private _disabled = false;
  private _value: string;
  private _onTouchedCallback: () => void;
  private _onChangeCallback: (value: string) => void;

  constructor(
    @Optional() @Self() public ngControl: NgControl,
    private readonly focusMonitor: FocusMonitor,
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly fileService: UserFileService,
    private readonly fireStorage: AngularFireStorage,
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
    return this._value;
  }
  set value(id: string) {
    this._value = id;

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
    return false; // Never float the label
  }

  get empty() {
    return !this._value;
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

  writeValue(id: string): void {
    this.value = id;
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

  getImageUrl(file: TanamFile) {
    return 'https://via.placeholder.com/768x576';
  }

  removeImage() {
    console.log('Remove current image');
  }

  replaceImage() {
    console.log('Replace current image');
  }
}
