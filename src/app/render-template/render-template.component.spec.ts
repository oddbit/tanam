import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RenderTemplateComponent } from './render-template.component';

describe('RenderTemplateComponent', () => {
  let component: RenderTemplateComponent;
  let fixture: ComponentFixture<RenderTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RenderTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenderTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
