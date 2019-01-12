import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsDomainComponent } from './settings-domain.component';

describe('SettingsDomainComponent', () => {
  let component: SettingsDomainComponent;
  let fixture: ComponentFixture<SettingsDomainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsDomainComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsDomainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
