import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeFormComponent } from './theme-form.component';

describe('ThemeFormComponent', () => {
  let component: ThemeFormComponent;
  let fixture: ComponentFixture<ThemeFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThemeFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
