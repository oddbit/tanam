import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentReferenceComponent } from './document-reference.component';

describe('DocumentReferenceComponent', () => {
  let component: DocumentReferenceComponent;
  let fixture: ComponentFixture<DocumentReferenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentReferenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentReferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
