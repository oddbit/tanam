import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeAssetListComponent } from './theme-asset-list.component';

describe('ThemeAssetListComponent', () => {
  let component: ThemeAssetListComponent;
  let fixture: ComponentFixture<ThemeAssetListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThemeAssetListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemeAssetListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
