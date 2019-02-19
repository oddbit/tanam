import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeOverviewComponent } from './theme-overview.component';

describe('ThemeOverviewComponent', () => {
  let component: ThemeOverviewComponent;
  let fixture: ComponentFixture<ThemeOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThemeOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemeOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
