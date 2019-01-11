import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsSiteComponent } from './settings-site.component';

describe('SettingsSiteComponent', () => {
  let component: SettingsSiteComponent;
  let fixture: ComponentFixture<SettingsSiteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsSiteComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsSiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
