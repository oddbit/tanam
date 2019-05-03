import { TestBed } from '@angular/core/testing';

import { UserThemeAssetService } from './user-theme-asset.service';

describe('UserThemeAssetService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserThemeAssetService = TestBed.get(UserThemeAssetService);
    expect(service).toBeTruthy();
  });
});
