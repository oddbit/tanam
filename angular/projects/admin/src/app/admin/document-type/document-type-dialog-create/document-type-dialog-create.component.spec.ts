import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentTypeDialogCreateComponent } from './document-type-dialog-create.component';

describe('DocumentTypeDialogCreateComponent', () => {
  let component: DocumentTypeDialogCreateComponent;
  let fixture: ComponentFixture<DocumentTypeDialogCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentTypeDialogCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentTypeDialogCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
