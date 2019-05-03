import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeTemplateDialogListTemplateComponent } from './theme-template-dialog-list-template.component';

describe('ThemeTemplateDialogListTemplateComponent', () => {
  let component: ThemeTemplateDialogListTemplateComponent;
  let fixture: ComponentFixture<ThemeTemplateDialogListTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThemeTemplateDialogListTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemeTemplateDialogListTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
