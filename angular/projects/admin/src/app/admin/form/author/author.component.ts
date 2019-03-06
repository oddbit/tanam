import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, ValidationErrors } from '@angular/forms';

interface Author {
  name: string;
  profileUrl: string;
  email: string;
}
@Component({
  selector: 'tanam-author',
  templateUrl: './author.component.html',
  styleUrls: ['./author.component.scss']
})

export class AuthorComponent implements OnInit, OnChanges {
  readonly reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';

  @Input() title: string;
  @Output() changeEvent = new EventEmitter<object>();
  @Input() author: Author;

  authorForm = this.formBuilder.group({
    name: [null, Validators.required],
    profileUrl: [null, Validators.pattern(this.reg)],
    email: [null, Validators.email],
  });

  constructor(
    private readonly formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    if (this.author) { this.authorForm.patchValue(this.author); }
  }

  ngOnChanges() {
    this.authorForm.valueChanges.subscribe(val => {
      this.sendToDocument({
        ...val,
        valid: this.authorForm.valid
      });
    });
  }

  sendToDocument (val: object) {
    this.changeEvent.emit(val);
  }

}
