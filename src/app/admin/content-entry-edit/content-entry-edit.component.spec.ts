import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentEntryEditComponent } from './content-entry-edit.component';

describe('ContentEntryEditComponent', () => {
  let component: ContentEntryEditComponent;
  let fixture: ComponentFixture<ContentEntryEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContentEntryEditComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentEntryEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
