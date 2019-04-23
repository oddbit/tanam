import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaDialogDeleteComponent } from './media-dialog-delete.component';

describe('MediaDialogDeleteComponent', () => {
  let component: MediaDialogDeleteComponent;
  let fixture: ComponentFixture<MediaDialogDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MediaDialogDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaDialogDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
