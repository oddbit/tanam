import { Component, Input, Optional, Self, ElementRef, HostBinding, ViewChild, OnDestroy, NgZone } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { NgControl } from '@angular/forms';
import { FocusMonitor } from '@angular/cdk/a11y';
import { Subject } from 'rxjs';
import { FilePickerDialogComponent } from '../file-picker/file-picker-dialog/file-picker-dialog.component';
import { MatDialog } from '@angular/material';


@Component({
  selector: 'tanam-rich-textbox',
  templateUrl: './rich-textbox.component.html',
  styleUrls: ['./rich-textbox.component.scss']
})
export class RichTextboxComponent implements OnDestroy  {

  private static _nextId = 0;

  @HostBinding('attr.aria-describedby') describedBy = '';
  @HostBinding() id = `textbox-rich-${RichTextboxComponent._nextId++}`;
  @ViewChild('container', { read: ElementRef, static: false }) container: ElementRef;
  @ViewChild('CkEditor', { read: ElementRef, static: false }) CkEditor: ElementRef;

  @Input() editorConfig: any;

  stateChanges = new Subject<void>();
  controlType = 'textbox-rich';
  shouldLabelFloat = true;

  required: boolean;
  errorState: boolean;
  autofilled?: boolean;

  editorData: string;
  ckEditorConfig = {
    'removeButtons': 'Image',
    'height': '300px'
  };

  private _disabled = false;
  private _focused = false;
  private _placeholder: string;
  private _onTouchedCallback: () => void;
  private _onChangeCallback: (value: string) => void;
  constructor(
    @Optional() @Self() public ngControl: NgControl,
    private readonly focusMonitor: FocusMonitor,
    private readonly elementRef: ElementRef<HTMLElement>,
    private dialog: MatDialog,
    private _zone: NgZone, _elm: ElementRef
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
    // this.formEditor.isReadOnly = isDisabled;
  }

  onChange(editor) {
    this._onChangeCallback(editor);
    this.stateChanges.next();
  }

  onEditorChange(event) {
    console.log('onEditorChange', event);
  }

  onFileUploadRequest(event) {
    console.log('onFileUploadRequest', event);
  }

  onFileUploadResponse(event) {
    console.log('onFileUploadResponse', event);
  }

  insert_name (event) {
    this._zone.run(() => {
      const dialogRef = this.dialog.open(FilePickerDialogComponent, {width: '800px'});
      const subscription = dialogRef.afterClosed().subscribe(file => {
        if (!!file) {
          event.insertHtml(`<img src=https://tanam-e8e7d.firebaseapp.com/_/file/${file.id}?s=medium />`, 'unfiltered_html');
        }

        if (!!subscription && !subscription.closed) {
          subscription.unsubscribe();
        }
      });
    });
  }
}
