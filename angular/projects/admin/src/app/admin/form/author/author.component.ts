import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'tanam-author',
  templateUrl: './author.component.html',
  styleUrls: ['./author.component.scss']
})
export class AuthorComponent implements OnInit, OnChanges {

  @Input() title: string;
  @Output() changeEvent = new EventEmitter<object>();

  authorForm = this.formBuilder.group({
    name: [null, Validators.required],
    profileUrl: [null],
    email: [null],
  });

  constructor(
    private readonly formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.authorForm.valueChanges.subscribe(val => {
      this.sendToDocument(val);
    });

  }

  sendToDocument (val: object) {
    this.changeEvent.emit(val);
  }

}
