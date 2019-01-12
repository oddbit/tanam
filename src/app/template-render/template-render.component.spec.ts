import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateRenderComponent } from './template-render.component';

describe('TemplateRenderComponent', () => {
  let component: TemplateRenderComponent;
  let fixture: ComponentFixture<TemplateRenderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateRenderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateRenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
