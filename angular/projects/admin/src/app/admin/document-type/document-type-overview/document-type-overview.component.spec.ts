import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentTypeOverviewComponent } from './document-type-overview.component';

describe('DocumentTypeOverviewComponent', () => {
  let component: DocumentTypeOverviewComponent;
  let fixture: ComponentFixture<DocumentTypeOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentTypeOverviewComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentTypeOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
