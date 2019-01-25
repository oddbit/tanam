import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentEntryNewComponent } from './content-entry-new.component';

describe('ContentEntryNewComponent', () => {
  let component: ContentEntryNewComponent;
  let fixture: ComponentFixture<ContentEntryNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentEntryNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentEntryNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
