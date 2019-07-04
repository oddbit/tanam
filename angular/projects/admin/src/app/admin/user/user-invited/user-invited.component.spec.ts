import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserInvitedComponent } from './user-invited.component';

describe('UserInvitedComponent', () => {
  let component: UserInvitedComponent;
  let fixture: ComponentFixture<UserInvitedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserInvitedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserInvitedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
