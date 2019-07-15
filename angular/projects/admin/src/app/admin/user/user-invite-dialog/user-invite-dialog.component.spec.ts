import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserInviteDialogComponent } from './user-invite-dialog.component';

describe('UserInviteDialogComponent', () => {
  let component: UserInviteDialogComponent;
  let fixture: ComponentFixture<UserInviteDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserInviteDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserInviteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
