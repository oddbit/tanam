import { TestBed } from '@angular/core/testing';

import { SiteSettingsService } from './site-settings.service';

describe('SiteSettingsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SiteSettingsService = TestBed.get(SiteSettingsService);
    expect(service).toBeTruthy();
  });
});
