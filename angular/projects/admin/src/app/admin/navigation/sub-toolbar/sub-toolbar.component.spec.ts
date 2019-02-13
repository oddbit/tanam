import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubToolbarComponent } from './sub-toolbar.component';

describe('SubToolbarComponent', () => {
  let component: SubToolbarComponent;
  let fixture: ComponentFixture<SubToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
