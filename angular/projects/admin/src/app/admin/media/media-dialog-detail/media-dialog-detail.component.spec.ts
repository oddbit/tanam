import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaDialogDetailComponent } from './media-dialog-detail.component';

describe('MediaDialogDetailComponent', () => {
  let component: MediaDialogDetailComponent;
  let fixture: ComponentFixture<MediaDialogDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MediaDialogDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaDialogDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
