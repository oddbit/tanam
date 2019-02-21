import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeTemplateOverviewComponent } from './theme-template-overview.component';

describe('ThemeTemplateOverviewComponent', () => {
  let component: ThemeTemplateOverviewComponent;
  let fixture: ComponentFixture<ThemeTemplateOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ThemeTemplateOverviewComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemeTemplateOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
