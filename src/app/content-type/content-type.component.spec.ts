import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentTypeComponent } from './content-type.component';

describe('ContentTypeComponent', () => {
  let component: ContentTypeComponent;
  let fixture: ComponentFixture<ContentTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
