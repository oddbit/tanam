import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentTypeEntryListComponent } from './content-type-entry-list.component';

describe('ContentTypeEntryListComponent', () => {
  let component: ContentTypeEntryListComponent;
  let fixture: ComponentFixture<ContentTypeEntryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContentTypeEntryListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentTypeEntryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
