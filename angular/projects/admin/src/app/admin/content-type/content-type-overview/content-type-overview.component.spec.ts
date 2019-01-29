import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentTypeOverviewComponent } from './content-type-overview.component';

describe('ContentTypeOverviewComponent', () => {
  let component: ContentTypeOverviewComponent;
  let fixture: ComponentFixture<ContentTypeOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentTypeOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentTypeOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
