import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentEntryListComponent } from './content-entry-list.component';

describe('ContentEntryListComponent', () => {
  let component: ContentEntryListComponent;
  let fixture: ComponentFixture<ContentEntryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContentEntryListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentEntryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
