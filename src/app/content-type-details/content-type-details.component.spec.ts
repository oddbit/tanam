import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentTypeDetailsComponent } from './content-type-details.component';

describe('ContentTypeDetailsComponent', () => {
  let component: ContentTypeDetailsComponent;
  let fixture: ComponentFixture<ContentTypeDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentTypeDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentTypeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
