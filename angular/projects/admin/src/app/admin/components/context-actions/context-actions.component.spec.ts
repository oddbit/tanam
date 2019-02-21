import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextActionsComponent } from './context-actions.component';

describe('ContextActionsComponent', () => {
  let component: ContextActionsComponent;
  let fixture: ComponentFixture<ContextActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContextActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
