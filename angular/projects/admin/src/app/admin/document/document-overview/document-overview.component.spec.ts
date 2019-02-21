import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentOverviewComponent } from './document-overview.component';

describe('DocumentOverviewComponent', () => {
  let component: DocumentOverviewComponent;
  let fixture: ComponentFixture<DocumentOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
