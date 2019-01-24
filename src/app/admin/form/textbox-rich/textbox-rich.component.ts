import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, ElementRef, HostBinding, Input, OnDestroy, OnInit, Optional, Self, ViewChild } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Subject, BehaviorSubject, Subscription } from 'rxjs';
import Quill from 'quill';

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
  private static _nextId = 0;

  @HostBinding('attr.aria-describedby') describedBy = '';
  @HostBinding() id = `textbox-rich-${TextboxRichComponent._nextId++}`;
  @ViewChild('container', { read: ElementRef }) container: ElementRef;

  stateChanges = new Subject<void>();
  controlType = 'textbox-rich';
  shouldLabelFloat = false;

  required: boolean;
  errorState: boolean; // TODO: Fixme
  autofilled?: boolean;

  private _editor: any;
  private _placeholder: string;
  private _textContent$ = new BehaviorSubject<string>('');
  private _focused$ = new BehaviorSubject<boolean>(false);
  private _enabled$ = new BehaviorSubject<boolean>(true);
  private _subscriptions: Subscription[] = [];
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
    return !this._editor.getText() || this._editor.getText().trim().length === 0;
  }

  @Input()
  get disabled() {
    return this._enabled$.value;
  }
  set disabled(flag) {
    this._enabled$.next(flag);
    this.stateChanges.next();
  }

  @Input()
  get value(): string {
    // tslint:disable-next-line:no-debugger
    debugger;
    return this._editor.getText();
  }
  set value(value: string) {
    this._textContent$.next(value);
  }

  get focused() {
    return this._editor.hasFocus();
  }

  set focused(flag: boolean) {
    this._focused$.next(coerceBooleanProperty(flag));
  }

  ngOnInit() {
    const editorElementRef = this.elementRef.nativeElement.querySelector('#editor');
    const editor = new Quill(editorElementRef, { theme: 'snow' });
    this._editor = editor;

    this._subscriptions.push(this._textContent$.subscribe(text => {
      this._editor.setText(text);
    }));

    this._subscriptions.push(this._enabled$.subscribe(isEnabled => {
      this._editor.enable(isEnabled);
    }));

    this._subscriptions.push(this._focused$.subscribe(isFocused => {
      if (isFocused) {
        this._editor.focus();
      } else {
        this._editor.blur();
      }
    }));

    this._editor.on('text-change', () => {
      this.stateChanges.next();
      this._onChangeCallback(this._editor.getText().trim());
    });

    this._editor.on('editor-change', () => {
      this._onTouchedCallback();
    });
  }

  ngOnDestroy() {
    this.stateChanges.complete();
    this.focusMonitor.stopMonitoring(this.elementRef.nativeElement);
    this._subscriptions.forEach(s => !s.closed && s.unsubscribe());
  }

  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }

  onContainerClick(event: MouseEvent): void {
    this._editor.focus();
    this._focused$.next(true);
  }

  writeValue(text: string): void {
    this._textContent$.next(text);
  }

  registerOnChange(callback: (val: any) => void): void {
    this._onChangeCallback = callback;
  }

  registerOnTouched(callback: () => void): void {
    this._onTouchedCallback = callback;
  }

  setDisabledState(isDisabled: boolean): void {
    this._enabled$.next(!coerceBooleanProperty(isDisabled));
  }
}
