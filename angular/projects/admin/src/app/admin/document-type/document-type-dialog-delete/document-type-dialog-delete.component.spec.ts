import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentTypeDialogDeleteComponent } from './document-type-dialog-delete.component';

describe('DocumentTypeDialogDeleteComponent', () => {
  let component: DocumentTypeDialogDeleteComponent;
  let fixture: ComponentFixture<DocumentTypeDialogDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentTypeDialogDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentTypeDialogDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
