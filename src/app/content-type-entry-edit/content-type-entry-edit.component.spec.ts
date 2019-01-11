import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentTypeEntryEditComponent } from './content-type-entry-edit.component';

describe('ContentTypeEntryEditComponent', () => {
  let component: ContentTypeEntryEditComponent;
  let fixture: ComponentFixture<ContentTypeEntryEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentTypeEntryEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentTypeEntryEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
