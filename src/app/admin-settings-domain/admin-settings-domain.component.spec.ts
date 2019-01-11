import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSettingsDomainComponent } from './admin-settings-domain.component';

describe('AdminSettingsDomainComponent', () => {
  let component: AdminSettingsDomainComponent;
  let fixture: ComponentFixture<AdminSettingsDomainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminSettingsDomainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSettingsDomainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
