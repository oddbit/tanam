import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSettingsSiteComponent } from './admin-settings-site.component';

describe('AdminSettingsSiteComponent', () => {
  let component: AdminSettingsSiteComponent;
  let fixture: ComponentFixture<AdminSettingsSiteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminSettingsSiteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSettingsSiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
