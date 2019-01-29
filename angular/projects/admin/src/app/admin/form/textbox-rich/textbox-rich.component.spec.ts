import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextboxRichComponent } from './textbox-rich.component';

describe('TextboxRichComponent', () => {
  let component: TextboxRichComponent;
  let fixture: ComponentFixture<TextboxRichComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextboxRichComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextboxRichComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
