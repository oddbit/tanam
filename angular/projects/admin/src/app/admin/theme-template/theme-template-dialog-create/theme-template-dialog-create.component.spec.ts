import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeTemplateDialogCreateComponent } from './theme-template-dialog-create.component';

describe('ThemeTemplateDialogCreateComponent', () => {
  let component: ThemeTemplateDialogCreateComponent;
  let fixture: ComponentFixture<ThemeTemplateDialogCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThemeTemplateDialogCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemeTemplateDialogCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
