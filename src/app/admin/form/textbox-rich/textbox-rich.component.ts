import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, ElementRef, HostBinding, Input, OnDestroy, OnInit, Optional, Self, ViewChild } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Subject } from 'rxjs';
import * as Quill from 'quill';

@Component({
  selector: 'app-textbox-rich',
  template: '<div id="editor"></div>',
  styleUrls: ['./textbox-rich.component.scss'],
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: TextboxRichComponent,
    },
  ],
})
export class TextboxRichComponent implements MatFormFieldControl<string>, ControlValueAccessor, OnInit, OnDestroy {

  @Input()
  get placeholder() {
    return this._placeholder;
  }
  set placeholder(placeholder) {
    this._placeholder = placeholder;
    this.stateChanges.next();
  }

  get empty() {
    return false; // TODO: Check with the form
  }

  @Input()
  get disabled() {
    return this._disabled;
  }
  set disabled(flag) {
    this._disabled = coerceBooleanProperty(flag);
    this.stateChanges.next();
  }

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
  get value(): string {
    return this._editor.getText();
  }
  set value(value: string) {
    this._editor.setText(value);
    this.stateChanges.next();
  }
  private static _nextId = 0;

  stateChanges = new Subject<void>();
  controlType = 'textbox-rich';

  // ALways float the label since it won't look good if it displays inside the text field
  shouldLabelFloat = false;

  @HostBinding('attr.aria-describedby') describedBy = '';
  @HostBinding() id = `textbox-rich-${TextboxRichComponent._nextId++}`;
  private _placeholder: string;
  private _disabled = false;

  get focused() {
    return this._editor.hasFocus();
  }

  set focused(flag: boolean) {
    if (flag) {
      this._editor.focus();
    } else {
      this._editor.blur();
    }
  }

  required: boolean;
  errorState: boolean; // TODO: Fixme
  autofilled?: boolean;
  private _editor: any;

  ngOnInit() {
    const editorElementRef = this.elementRef.nativeElement.querySelector('#editor');
    this._editor = new Quill(editorElementRef, { theme: 'snow' });
  }

  ngOnDestroy() {
    this.stateChanges.complete();
    this.focusMonitor.stopMonitoring(this.elementRef.nativeElement);
  }

  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }

  onContainerClick(event: MouseEvent): void {
    this._editor.focus();
  }

  writeValue(text: string): void {
    this._editor.setText(text);
  }

  registerOnChange(callback: (val: any) => void): void {
    this._editor.on('text-change', (delta: any, oldContents: any, source: string) => {
      if (source === 'api') {
        console.log('An API call triggered this change.');
      } else if (source === 'user') {
        console.log('A user action triggered this change.');
      }

      this.stateChanges.next();
      callback(delta);
    });
  }

  registerOnTouched(callback: () => void): void {
    this._editor.on('editor-change', (eventName: string) => {
      if (eventName === 'text-change') {
        // args[0] will be delta
      } else if (eventName === 'selection-change') {
        // args[0] will be old range
      }
    });

    callback();
  }

  setDisabledState(isDisabled: boolean): void {
    if (coerceBooleanProperty(isDisabled)) {
      this._editor.disable();
    } else {
      this._editor.enable();
    }
  }
}
