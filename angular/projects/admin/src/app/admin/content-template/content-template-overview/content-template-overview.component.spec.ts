import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentTemplateOverviewComponent } from './content-template-overview.component';

describe('ContentTemplateOverviewComponent', () => {
  let component: ContentTemplateOverviewComponent;
  let fixture: ComponentFixture<ContentTemplateOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContentTemplateOverviewComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentTemplateOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
