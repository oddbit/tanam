import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentDialogDeleteComponent } from './document-dialog-delete.component';

describe('DocumentDialogDeleteComponent', () => {
  let component: DocumentDialogDeleteComponent;
  let fixture: ComponentFixture<DocumentDialogDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentDialogDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentDialogDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
