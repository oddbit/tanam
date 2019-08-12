import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RichTextboxComponent } from './rich-textbox.component';

describe('RichTextboxComponent', () => {
  let component: RichTextboxComponent;
  let fixture: ComponentFixture<RichTextboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RichTextboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RichTextboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
