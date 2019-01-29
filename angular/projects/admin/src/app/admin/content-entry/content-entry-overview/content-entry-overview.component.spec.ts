import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentEntryOverviewComponent } from './content-entry-overview.component';

describe('ContentEntryOverviewComponent', () => {
  let component: ContentEntryOverviewComponent;
  let fixture: ComponentFixture<ContentEntryOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentEntryOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentEntryOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
