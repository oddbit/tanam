import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, ElementRef, HostBinding, Input, OnDestroy, OnInit, Optional, Self, ViewChild } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { CKEditor5 } from '@ckeditor/ckeditor5-angular/ckeditor';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Subject } from 'rxjs';

@Component({
  selector: 'tanam-textbox-rich',
  templateUrl: './textbox-rich.component.html',
  styleUrls: ['./textbox-rich.component.scss'],
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: TextboxRichComponent,
    },
  ],
})
export class TextboxRichComponent implements MatFormFieldControl<string>, ControlValueAccessor, OnDestroy {
  private static _nextId = 0;

  @HostBinding('attr.aria-describedby') describedBy = '';
  @HostBinding() id = `textbox-rich-${TextboxRichComponent._nextId++}`;
  @ViewChild('container', { read: ElementRef, static: false }) container: ElementRef;

  @Input() editorConfig: any;

  stateChanges = new Subject<void>();
  controlType = 'textbox-rich';
  shouldLabelFloat = true;

  required: boolean;
  errorState: boolean;
  autofilled?: boolean;

  formEditor: CKEditor5.Editor = ClassicEditor;
  editorData: string;

  private _disabled = false;
  private _focused = false;
  private _placeholder: string;
  private _onTouchedCallback: () => void;
  private _onChangeCallback: (value: string) => void;

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
    return !this.editorData || this.editorData.trim().length === 0;
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
  get value(): string {
    if (!this.editorData || this.editorData.trim().length === 0) {
      return null;
    }

    return this.editorData.trim();
  }

  set value(value: string) {
    this.editorData = value || '';
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
    this.editorData = text || '';
  }

  registerOnChange(callback: (val: any) => void): void {
    this._onChangeCallback = callback;
  }

  registerOnTouched(callback: () => void): void {
    this._onTouchedCallback = callback;
  }

  setDisabledState(isDisabled: boolean): void {
    this.formEditor.isReadOnly = isDisabled;
  }

  onChange({ editor }: ChangeEvent) {
    this._onChangeCallback(editor.getData());
    this.stateChanges.next();
  }
}
