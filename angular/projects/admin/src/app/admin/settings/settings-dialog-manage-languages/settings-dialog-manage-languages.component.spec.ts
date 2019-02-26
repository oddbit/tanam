import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsDialogManageLanguagesComponent } from './settings-dialog-manage-languages.component';

describe('SettingsDialogManageLanguagesComponent', () => {
  let component: SettingsDialogManageLanguagesComponent;
  let fixture: ComponentFixture<SettingsDialogManageLanguagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsDialogManageLanguagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsDialogManageLanguagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
