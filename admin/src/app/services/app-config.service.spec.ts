import { TestBed } from '@angular/core/testing';

import { AppConfigService } from './app-config.service';

describe('AppConfigService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AppConfigService = TestBed.get(AppConfigService);
    expect(service).toBeTruthy();
  });
});
