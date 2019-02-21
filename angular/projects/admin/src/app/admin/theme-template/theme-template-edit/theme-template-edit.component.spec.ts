import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeTemplateEditComponent } from './theme-template-edit.component';

describe('ThemeTemplateEditComponent', () => {
  let component: ThemeTemplateEditComponent;
  let fixture: ComponentFixture<ThemeTemplateEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ThemeTemplateEditComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemeTemplateEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
